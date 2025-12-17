import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const config = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.archbee.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
    // Silence pino-pretty warning from @walletconnect dependencies (webpack only)
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        config.resolve.alias = {
            ...config.resolve.alias,
            'pino-pretty': false,
        };
        return config;
    },
};

const withMDX = createMDX({
    // Add markdown plugins here, as desired
});

export default withMDX(config);
