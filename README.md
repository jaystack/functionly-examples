# Functionly examples
## Functionly configuration
The `functionly.json` contains the default configuration of the CLI, just create this file in the project root.

### example:
```js
{
    "awsRegion": "us-east-1",
    "main": "./src/index.js",
    "deployTarget": "aws",
    "localPort": 3000,
    "stage": "dev",
    "watch": true,
    "compile": "babel-loader"
}
```

## Javascript
- [greeter](https://github.com/jaystack/functionly-examples/tree/master/greeter)
- [todoDB](https://github.com/jaystack/functionly-examples/tree/master/todoDB-es6)

## Typescript
- [todoDB](https://github.com/jaystack/functionly-examples/tree/master/todoDB)
- [todoDB-mongo](https://github.com/jaystack/functionly-examples/tree/master/todoDB-mongo)
- [todoDBAdvanced](https://github.com/jaystack/functionly-examples/tree/master/todoDBAdvanced)
- [eventSource](https://github.com/jaystack/functionly-examples/tree/master/eventSource)
