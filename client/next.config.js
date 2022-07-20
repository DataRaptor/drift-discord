/** @type {import('next').NextConfig} */
module.exports = {
      reactStrictMode: true,
      env: {
            API_URL: 'http://localhost:8080',
            // API_URL: 'https://api-4fpiw4senq-ue.a.run.app'
      },
      typescript: {
            // !! WARN !!
            // Dangerously allow production builds to successfully complete even if
            // your project has type errors.
            // !! WARN !!
            ignoreBuildErrors: true,
      },
      eslint: {
            ignoreDuringBuilds: true,
      },
}
