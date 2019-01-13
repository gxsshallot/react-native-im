module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "jest": true,
    },
    "extends": [
        "eslint:recommended",
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "import",
        "react",
        "react-native",
    ],
    "parser": "babel-eslint",
    "rules": {
        "array-callback-return": 2, // Enforces return statements in callbacks of array’s methods 
        "indent": [2, 4, {
            SwitchCase: 1,
        }], // enforce consistent indentation
        "linebreak-style": [2, "unix"], // enforce consistent linebreak style
        "no-var": 2, // require let or const instead of var
        "semi": 2, // require or disallow semicolons instead of ASI
        "switch-colon-spacing": [2, {"after": true, "before": false}], // enforce spacing around colons of switch statements
        "default-case": 2, // require default cases in switch statements
        "no-extra-parens": [2, "all", {
            "conditionalAssign": true,
            "returnAssign": true,
            "ignoreJSX": "multi-line",
        }], // disallow unnecessary parentheses
        "no-console": 0, // disallow the use of console
        "no-alert": 2, // disallow the use of alert, confirm, and prompt
        "no-empty-function": 2, // disallow empty functions
        "no-unreachable": 2, // disallow unreachable code after return, throw, continue, and break statements
        "no-multiple-empty-lines": [2, {
            "max": 1,
            "maxEOF": 1,
            "maxBOF": 0,
        }], // disallow multiple empty lines
        "no-unused-vars": [2, { // disallow unused variables
            "argsIgnorePattern": "^_"
        }],
        "padded-blocks": [2, {
            "blocks": "never",
            "classes": "never",
            "switches": "never",
        }], // require or disallow padding within blocks
        "prefer-const": 2, // require const declarations for variables that are never reassigned after declared
        "space-before-blocks": [2, "always"], // enforce consistent spacing before blocks
        "space-in-parens": [2, "never"], // space-in-parens
        "space-before-function-paren": [2, {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always",
        }], // enforce consistent spacing before function definition opening parenthesis
        "space-unary-ops": [2, {
            "words": true,
            "nonwords": false,
        }], // enforce consistent spacing before or after unary operators
        "space-infix-ops": [2, {"int32Hint": true}], // require spacing around infix operators
        "spaced-comment": [2, "always"], // enforce consistent spacing after the // or /* in a comment
        "no-duplicate-imports": 2, // disallow duplicate module imports
        "no-restricted-imports": 2, // disallow specified modules when loaded by import
        // import：参照https://github.com/benmosher/eslint-plugin-import
        "import/first": 2,
        "import/newline-after-import": [2, {"count": 1}],
        "import/no-cycle": 2,
        "import/no-duplicates": 2,
        "import/no-dynamic-require": 2,
        "import/no-nodejs-modules": 2,
        "import/no-self-import": 2,
        // react：参照https://github.com/yannickcr/eslint-plugin-react
        "react/default-props-match-prop-types": 0, // TODO 暂时禁用
        "react/display-name": 0,
        "react/no-children-prop": 2,
        "react/no-deprecated": 2,
        "react/no-did-mount-set-state": 2,
        "react/no-direct-mutation-state": 2,
        "react/no-find-dom-node": 2,
        "react/no-is-mounted": 2,
        "react/no-redundant-should-component-update": 2,
        "react/no-render-return-value": 2,
        "react/no-string-refs": 2,
        "react/no-unescaped-entities": 2,
        "react/no-unknown-property": 2,
        "react/prop-types": 0, // TODO 暂时禁用
        "react/react-in-jsx-scope": 2,
        "react/require-render-return": 2,
        "react/jsx-closing-tag-location": 2,
        "react/jsx-closing-bracket-location": 2,
        "react/jsx-curly-spacing": [2, {"when": "never"}],
        "react/jsx-equals-spacing": [2, "never"],
        "react/jsx-first-prop-new-line": [2, "multiline-multiprop"],
        "react/jsx-indent": [2, 4],
        "react/jsx-indent-props": [2, 4],
        "react/jsx-key": 2,
        "react/jsx-max-depth": [2, {"max": 4}],
        "react/jsx-max-props-per-line": [2, {"maximum": 2}],
        "react/jsx-no-comment-textnodes": 2,
        "react/jsx-no-duplicate-props": 2,
        "react/jsx-no-literals": 2,
        "react/jsx-no-undef": [2, {"allowGlobals": true}],
        "react/jsx-one-expression-per-line": 2,
        "react/jsx-props-no-multi-spaces": 2,
        "react/jsx-tag-spacing": [2, {
            "closingSlash": "never",
            "beforeSelfClosing": "always",
            "afterOpening": "never"
        }],
        "react/jsx-uses-react": 2,
        "react/jsx-uses-vars": 2,
        "react/jsx-wrap-multilines": [2, {
            "declaration": "parens-new-line",
            "assignment": "parens-new-line",
            "return": "parens-new-line",
            "arrow": "parens-new-line",
            "condition": "parens-new-line",
            "logical": "parens-new-line",
            "prop": "parens-new-line"
        }],
        // react-native：参照https://github.com/Intellicode/eslint-plugin-react-native
        "react-native/no-color-literals": 0,
        "react-native/no-inline-styles": 1,
        "react-native/no-unused-styles": 2,
    },
    "settings": {
        "react": {
            "createClass": "createReactClass",
            "pragma": "React", 
            "version": "16.5.0",
        },
        'import/resolver': {
            "node": {
                "extensions": [
                    ".js",
                    ".android.js",
                    ".ios.js",
                ],
            }
        },      
    },
};
