/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
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
        unoptimized: true
    },
    env: {
        BACKEND_ADDRESS: ""
    }
}

module.exports = nextConfig
