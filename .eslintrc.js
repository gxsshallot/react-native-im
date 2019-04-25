module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "jest": true,
    },
    "extends": [
        "plugin:automatic/typescript-react-native",
    ],
    "plugins": [
        "automatic",
    ],
    "rules": {
        "init-declarations": 0,
        "import/no-unresolved": [2, {
            "commonjs": true,
            "amd": true,
            "ignore": [
                "^react$",
                "^react-native$",
                "^react-navigation$",
            ],
        }],
    },
};
