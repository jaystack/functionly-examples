# Todo app with Functionly
This quick start guide will teach you how to create a Todo app with [Functionly](https://www.npmjs.com/package/functionly).

In this tutorial you will:

* [Create an empty es6 Functionly project](#create-an-empty-es6-functionly-project)
* [Create a dynamo table](#create-a-dynamo-table)
* [Create functional services](#create-functional-services)
* [Read todos](#read-todos)
* [Create todo](#create-todo)
* *[Extend with Services](#extend-the-example-with-Services) - optional*
* [Run and Deploy with CLI](#run-and-deploy-with-cli)
* [AWS deployment](#aws-deployment)

## Create an empty es6 Functionly project
It's a simple npm project. You can separate the source code to more files but in the example we put all of the code into the `./src/todoDB.js`
### Dependencies
- functionly
- shortid
```sh
npm install --save functionly shortid
```

### Dev dependencies
Functionly uses webpack with babel for compile the code.
- babel-core
- babel-loader
- babel-plugin-functionly-annotations
- babel-plugin-transform-async-to-generator
- babel-plugin-transform-decorators-legacy
- babel-preset-es2015-node5
```sh
npm install --save-dev babel-core babel-loader babel-plugin-functionly-annotations babel-plugin-transform-async-to-generator babel-plugin-transform-decorators-legacy babel-preset-es2015-node5
```

### Babel configuration
Default `.babelrc`

```js
{
  "plugins": [
    "functionly-annotations",
    "transform-decorators-legacy",
    "transform-async-to-generator"
  ],
  "presets": [
    "es2015-node5"
  ]
}
```

### Functionly configuration
Default `functionly.json`
```js
{
    "awsRegion": "us-east-1",
    "main": "./src/todoDB.js",
    "deployTarget": "aws",
    "localPort": 3000,
    "stage": "dev",
    "watch": true,
    "compile": "babel-loader"
}
```

## Create a dynamo table
We need a DynamoTable because we want to store todo items. It will be named as `TodoTable`.
```js
import { DynamoTable, dynamoTable, injectable } from 'functionly'

@injectable()
@dynamo()
export class TodoTable extends DynamoTable { }
```

## Create functional services
Define a base class for FunctionalService to set basic Lambda settings in the AWS environment.
```js
import { FunctionalService, aws } from 'functionly'

@aws({ type: 'nodejs6.10', memorySize: 512, timeout: 3 })
export class TodoService extends FunctionalService { }
```

### Read todos
We need to create a service to read a todo items.
```js
export class GetAllTodos extends TodoService {
    async handle() {}
}
```
Decorate it with the [rest]() decorator. We need a `path` and have to set the `cors` and the `anonymous` properties to `true` because we want to call it without authentication and from another domain.
```js
@rest({ path: '/getAllTodos', cors: true, anonymous: true })
```
Define a [description]() for the `TodoService`, which will make it easier to find in the AWS Lambda list.
```js
@description('get all Todo service')
```
Now we have to create the business logic. We want to read the todo items, so we need to inject the `TodoTable`. Get the items from it and return from our service. If we do not set the `methods` property that means it will accept `GET` requests. (default: `methods: ['get']`)
```js
import { rest, description, inject } from 'functionly'

@rest({ path: '/getAllTodos', cors: true, anonymous: true })
@description('get all Todo service')
export class GetAllTodos extends TodoService {
    async handle(@inject(TodoTable) db) {
        let items = await db.scan()
        return { ok: 1, items }
    }
}
```
We are almost done, we just have to export our service from the main file.
```js
export const getAllTodos = GetAllTodos.createInvoker()
```

### Create todo
We need a service to create todo items, so let's do this. We will also define a [rest]() endpoint and a [description]().
```js
import { rest, description } from 'functionly'

@rest({ path: '/createTodo', methods: ['post'], anonymous: true, cors: true })
@description('create Todo service')
export class CreateTodo extends TodoService {
    async handle() {}
}
```
We need some values to create a new todo item: `name`, `description` and `status`. Expect these with the [param]() decorator and it will resolve them from the invocation context.
```js
import { rest, description, param } from 'functionly'

@rest({ path: '/createTodo', methods: ['post'], anonymous: true, cors: true })
@description('create Todo service')
export class CreateTodo extends TodoService {
    async handle(@param name, @param description, @param staus) {}
}
```
The business logic: save a new todo item. [Inject]() the `TodoTable` and save a new todo item with the `put` function. We need an id for the new todo, in the example we'll use [shortid](https://www.npmjs.com/package/shortid) to generate them.
```js
import { generate } from 'shortid'
import { rest, description, param } from 'functionly'

@rest({ path: '/createTodo', methods: ['post'], anonymous: true, cors: true })
@description('create Todo service')
export class CreateTodo extends TodoService {
    async handle(@param name, @param description, @param status, @inject(TodoTable) db) {
        let item = {
            id: generate(),
            name,
            description,
            status
        }

        await db.put({ Item: item })

        return { ok: 1, item }
    }
}

export const createTodo = CreateTodo.createInvoker()
```

## Extend the example with Services
> **Optional**

Create two services: validate and persist todo items. Then the CreateTodo has only to call these services.

### Validate todo
It will be an [injectable]() service and expect the three todo values, then implement a validation logic in the service.
```js
import { injectable, param } from 'functionly'

@injectable()
export class ValidateTodo extends Service {
    async handle( @param name, @param description, @param status) {
        const isValid = true
        return { isValid }
    }
}
```

### Persist todo
It will be an [injectable]() service and expect the three todo values and [inject]() a `TodoTable` then implement a persit logic in the service.
```js
import { injectable, param, inject } from 'functionly'

@injectable()
export class PersistTodo extends Service {
    async handle( @param name, @param description, @param status, @inject(TodoTable) db) {
        let item = {
            id: generate(),
            name,
            description,
            status
        }
        await db.put({ Item: item })
        return item
    }
}
```

### Changed CreateTodo FunctionalService
[inject]() the two new services(`ValidateTodo`, `PersistTodo`) and change the business logic
```js
import { rest, description, param, inject } from 'functionly'

@rest({ path: '/createTodo', methods: ['post'], anonymous: true, cors: true })
@description('create Todo service')
export class CreateTodo extends TodoService {
    async handle( 
        @param name, 
        @param description, 
        @param status, 
        @inject(ValidateTodo) validateTodo,
        @inject(PersistTodo) persistTodo
    ) {
        let validateResult = await validateTodo({ name, description, status })
        if (!validateResult.isValid) {
            throw new Error('Todo validation error')
        }
        let persistTodoResult = await persistTodo({ name, description, status })
        return { ok: 1, persistTodoResult }
    }
}
```

### The source code of this example is available [here](https://github.com/jaystack/functionly-examples/tree/master/todoDB-es6)

# Install
```sh
npm install
```

# Run and Deploy with CLI
The CLI helps you to deploy and run the application. 
1. CLI install
```sh
npm install functionly -g
```

## Local deployment
1. Create DynamoDB with Docker
```sh
docker run -d --name dynamodb -p 8000:8000 peopleperhour/dynamodb
```
2. Deploy will create the tables in DynamoDB
> Note: Create the [functionly.json](https://raw.githubusercontent.com/jaystack/functionly-examples/master/todoDB/functionly.json) in the project for short commands. Also, you don't have to pass all arguments.
```sh
functionly deploy local
```
## Run in local environment
During development, you can run the application on your local machine.
```sh
functionly local
```

## AWS deployment
> [Set up](http://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html) AWS Credentials before deployment.

> Note: Create the [functionly.json](https://raw.githubusercontent.com/jaystack/functionly-examples/master/todoDB/functionly.json) in the project for short commands. Also, you don't have to pass all arguments. As the `deployTarget` is configured as `aws` (the default value configured) then the deploy command will use this as deployment target.

Functionly will create the package and deploy the application to AWS. The package is a [CloudFormation](https://aws.amazon.com/cloudformation/) template, it contains all the AWS resources so AWS can create or update the application's resources based on the template.
```sh
functionly deploy
```

> Congratulations! You have just created and deployed your first `functionly` application!
