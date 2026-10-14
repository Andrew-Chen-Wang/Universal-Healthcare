import * as path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  // TEMPORARY: lets the /paths/review page work from a phone over Tailscale or the LAN.
  allowedDevOrigins: ["a-macbook-pro.tail8b7bc3.ts.net", "*.ts.net", "192.168.*.*"],
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
}

export default nextConfig
