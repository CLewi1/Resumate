import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["better-sqlite3"],
    turbopack: {
        root: path.resolve(__dirname),
    },
};

export default nextConfig;
