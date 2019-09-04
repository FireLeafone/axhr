module.exports = function (api) {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        "modules": "auto",
        "targets": {
          "browsers": [
            "> 1%",
            "last 2 versions",
            "not ie <= 8"
          ],
          node: 'current'
        }
      }
    ]
  ];

  const plugins = [
    "@babel/plugin-transform-runtime",
  ];

  return {
    presets,
    plugins
  };
};
