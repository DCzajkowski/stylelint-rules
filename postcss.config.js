module.exports = () => ({
  plugins: [
    require('postcss-cssnext')({
      features: {
        rem: false,
      },
    }),
  ],
});
