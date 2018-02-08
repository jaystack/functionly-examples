# GraphQL
TodoDB example with GraphQL

## Install
```sh
npm install
```
## Run in local
Run the project with functionly CLI
```sh
functionly deploy local
functionly start
```
## Try it local
### Create todo
```sh
curl -d '@content/createTodo.json' -H "Content-Type: application/json" -X POST http://localhost:3000/graphql
```
### Get by status
```sh
curl -d '@content/getByStatus.json' -H "Content-Type: application/json" -X POST http://localhost:3000/graphql
```
### Get
Replace the `<todoid>` to an existing id value
```sh
curl -d '{"query": "{todo(id:\"<todoid>\"){id,name}}"}' -H "Content-Type: application/json" -X POST http://localhost:3000/graphql
```



# Deploy to aws
Create and setup your AWS IAM role (Lambda execution)

```sh
functionly deploy
```

## Try it online
### Create todo
Replace the `<gatewayid>` after the deployment
```sh
curl -d '@content/createTodo.json' -H "Content-Type: application/json" -X POST https://<gatewayid>.execute-api.us-east-1.amazonaws.com/dev/graphql
```
### Get by status
Replace the `<gatewayid>` after the deployment
```sh
curl -d '@content/getByStatus.json' -H "Content-Type: application/json" -X POST https://<gatewayid>.execute-api.us-east-1.amazonaws.com/dev/graphql
```
### Get
Replace the `<gatewayid>` after the deployment \
Replace the `<todoid>` to an existing id value
```sh
curl -d '{"query": "{todo(id:\"<todoid>\"){id,name}}"}' -H "Content-Type: application/json" -X POST https://<gatewayid>.execute-api.us-east-1.amazonaws.com/dev/graphql
```