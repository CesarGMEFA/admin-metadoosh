/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:['api.lorem.space','api.escuelajs.co','placeimg.com', 'images.unsplash.com', 'api.dicebear.com']
  }
  // eslint:{
  //   ignoreDuringBuilds:true,
  // }
}

module.exports = nextConfig
