"""Offline regression checks for concurrent publishing and Pages supersession."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

SCRIPTS = Path(__file__).resolve().parent
GIT = shutil.which("git")


def run(*args, **kwargs):
    return subprocess.run(args, check=True, text=True, capture_output=True, **kwargs)


class PreviewRaces(unittest.TestCase):
    def test_concurrent_production_and_preview_preserve_both(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            remote = root / "remote.git"
            seed = root / "seed"
            run(GIT, "init", "--bare", str(remote))
            run(GIT, "init", "-b", "gh-pages", str(seed))
            run(GIT, "-C", str(seed), "config", "user.name", "Test")
            run(GIT, "-C", str(seed), "config", "user.email", "test@example.com")
            (seed / "index.html").write_text("old production")
            (seed / "pr-preview/pr-1").mkdir(parents=True)
            (seed / "pr-preview/pr-1/index.html").write_text("existing preview")
            run(GIT, "-C", str(seed), "add", ".")
            run(GIT, "-C", str(seed), "commit", "-m", "seed")
            run(GIT, "-C", str(seed), "push", str(remote), "gh-pages")
            # Hold both first pushes until both publishers have cloned the same tip.
            bin_dir = root / "bin"
            bin_dir.mkdir()
            wrapper = bin_dir / "git"
            wrapper.write_text('''#!/bin/bash
if [ "$1" = push ] && [ ! -f "$BARRIER/$LABEL.ready" ]; then
  touch "$BARRIER/$LABEL.ready"
  for i in {1..200}; do
    [ -f "$BARRIER/prod.ready" ] && [ -f "$BARRIER/preview.ready" ] && break
    sleep .05
  done
fi
exec "$REAL_GIT" "$@"
''')
            wrapper.chmod(0o755)
            env = dict(os.environ, PATH=f"{bin_dir}:{os.environ['PATH']}",
                       REAL_GIT=GIT, BARRIER=tmp, REMOTE_URL=str(remote))
            processes = []
            for label, target in (("prod", "."), ("preview", "pr-preview/pr-2")):
                source = root / label
                source.mkdir()
                (source / "index.html").write_text(label)
                output = root / f"{label}.output"
                job_env = dict(env, LABEL=label, KEEP="pr-preview", GITHUB_OUTPUT=str(output))
                processes.append((label, subprocess.Popen(
                    ["bash", str(SCRIPTS / "publish.sh"), "deploy", target, str(source)],
                    env=job_env, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)))
            logs = []
            for label, process in processes:
                stdout, stderr = process.communicate(timeout=60)
                self.assertEqual(process.returncode, 0, stdout + stderr)
                logs.append(stderr)
                values = dict(line.split("=", 1) for line in (root / f"{label}.output").read_text().splitlines())
                self.assertEqual(values['deployment_status'], 'success')
                self.assertEqual(run(GIT, "--git-dir", str(remote), "show", f"{values['deployed_commit_sha']}:" + ("index.html" if label == "prod" else "pr-preview/pr-2/index.html")).stdout, label)
            self.assertTrue(any("retrying on a fresh clone" in log for log in logs))
            for path, expected in (("index.html", "prod"), ("pr-preview/pr-1/index.html", "existing preview"), ("pr-preview/pr-2/index.html", "preview")):
                self.assertEqual(run(GIT, "--git-dir", str(remote), "show", f"gh-pages:{path}").stdout, expected)

    def test_wait_accepts_deployed_descendant_after_supersession(self):
        self.check_wait(descendant=True, expected=0)

    def test_wait_rejects_unrelated_success(self):
        self.check_wait(descendant=False, expected=1)

    def check_wait(self, descendant, expected):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            target, newer = "a" * 40, "b" * 40
            (root / "builds.json").write_text(json.dumps([
                {"commit": target, "status": "errored"},
                {"commit": newer, "status": "built"},
            ]))
            commands = {
                "curl": '#!/bin/sh\ncat "$FIXTURE/builds.json"\n',
                "sleep": '#!/bin/sh\nexit 0\n',
                "git": '''#!/bin/bash
if [ "$1" = clone ]; then mkdir -p "${@: -1}/.git"; exit 0; fi
if [ "$3" = merge-base ]; then exit "$ANCESTOR_EXIT"; fi
exit 0
''',
            }
            for name, content in commands.items():
                (root / name).write_text(content)
                (root / name).chmod(0o755)
            result = subprocess.run(["bash", str(SCRIPTS / "wait-for-pages-deployment.sh"), "owner/repo", target, "gh-pages", "fake-token"],
                                    env=dict(os.environ, PATH=f"{tmp}:{os.environ['PATH']}", FIXTURE=tmp,
                                             ANCESTOR_EXIT="0" if descendant else "1", PAGES_WAIT_TIMEOUT="50"),
                                    text=True, capture_output=True, timeout=5)
            self.assertEqual(result.returncode, expected, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
