import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["better-sqlite3"],
    turbopack: {
        root: path.resolve(__dirname),
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/dashboard",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
