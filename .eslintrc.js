module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        //"plugin:security/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "eslint-plugin-jsdoc",
        "eslint-plugin-import",
        "@typescript-eslint"
        
    ],
    "ignorePatterns": [
        ".eslintrc.js"
    ],
    "rules": {
        "semi": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-member-access": "off"
    }
};
