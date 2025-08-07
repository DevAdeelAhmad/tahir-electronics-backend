export default ({ env }) => ({
  upload: {
    config: {
      sizeLimit: 10 * 1024 * 1024, // 10MB limit
    },
  },
});
