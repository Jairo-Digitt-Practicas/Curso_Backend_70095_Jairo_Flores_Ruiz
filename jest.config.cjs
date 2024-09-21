/** @format */
// jest.config.cjs
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
    moduleNameMapper: {
        "^path$": require.resolve("path-browserify"),
    },
};
