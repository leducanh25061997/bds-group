module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      borderWidth: {
        1: '1px',
      },
      fontSize: {
        '10px': '10px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
