/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '*',
                port: '',
                pathname: '/**',
            },
        ],
    },
    env: {
        BACKEND_ADDRESS: "http://localhost:14590"
    }
}

module.exports = nextConfig
