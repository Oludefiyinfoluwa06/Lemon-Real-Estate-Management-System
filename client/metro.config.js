// metro.config.js (for Expo / React Native)
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // add common JS-ish extensions that sometimes help
  config.resolver = {
    ...config.resolver,
    sourceExts: [...(config.resolver.sourceExts || []), 'cjs', 'native'],
  };

  // If you need to explicitly include node_modules for transpilation,
  // add a block to allowlist the package (uncomment and adjust as needed)
  // config.transformer = {
  //   ...config.transformer,
  //   // custom transformer if needed
  // };
  return config;
})();
