const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
//const NodePolyfillPlugin = require("docusaurus-node-polyfills")

module.exports = {
	//resolve: {
  //  fallback: {
  //    // other fallbacks
  //     "util": require.resolve("util/"),
  //     "crypto": require.resolve("crypto-browserify")
  //  },
  //},
  
  // Other rules...
	plugins: [
		new NodePolyfillPlugin({
			excludeAliases: ['console']
		})
	]
};
