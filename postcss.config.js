const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV === "production") {
  module.exports = {
    plugins: {
      autoprefixer: {},
      cssnano: {},
    },
  };
} else {
  module.exports = {
    plugins: {
      autoprefixer: {},
    },
  };
}
