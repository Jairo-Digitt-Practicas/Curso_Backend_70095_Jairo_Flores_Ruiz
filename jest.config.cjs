/** @format */

module.exports = {
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".js"],
    moduleFileExtensions: ["js", "json", "node"],
};
