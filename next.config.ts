import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["bun:sqlite"],
    turbopack: {
        root: path.resolve(__dirname),
    },
};

export default nextConfig;
