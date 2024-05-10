/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: false,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false,
      }),
    );

    return config;
  },
};

module.exports = nextConfig;
