import adapter from '@sveltejs/adapter-cloudflare';

const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    })
  }
};

export default config;

