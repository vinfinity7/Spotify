export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true //browsers can handle top-level-await features
    },
  },
  build: {
    rollupOptions: {
      input: '/dist/index.html', // Make sure to specify the correct entry module
    },
  },
})