import * as path from "node:path"
import type { NextConfig } from "next"

/** STATIC_EXPORT=1 builds a plain static site (in `out/`) for GitHub Pages. */
const staticExport = process.env.STATIC_EXPORT === "1"

const nextConfig: NextConfig = {
  reactCompiler: true,
  // TEMPORARY: lets the /paths/review page work from a phone over Tailscale or the LAN.
  allowedDevOrigins: ["a-macbook-pro.tail8b7bc3.ts.net", "*.ts.net", "192.168.*.*"],
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
  ...(staticExport && {
    output: "export",
    // GitHub Pages serves /foo/ from foo/index.html.
    trailingSlash: true,
    images: { unoptimized: true },
  }),
}

export default nextConfig
