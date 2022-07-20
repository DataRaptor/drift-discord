/** @type {import('next').NextConfig} */
module.exports = {
      reactStrictMode: true,
      env: {
            API_URL: 'https://api-4fpiw4senq-ue.a.run.app',
      },
      typescript: {
            ignoreBuildErrors: true,
      },
      eslint: {
            ignoreDuringBuilds: true,
      },
}
