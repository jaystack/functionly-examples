# todoDB

## install and build
```sh
npm install
```


# deploy to local

create local dynamoDB with docker
```sh
docker run -d --name dynamodb -p 8000:8000 peopleperhour/dynamodb
```
local deploy will create your tables in local dynamoDB instance
```sh
functionly deploy local
```

# run in local
```sh
functionly start
```
then test it
```sh
curl -d '@content/todoPayload.json' -H "Content-Type: application/json" -X POST http://localhost:3000/createTodo
curl 'http://localhost:3000/getAllTodos'
```



# deploy to aws
create and setup your AWS IAM role (Lambda execution, dynamo table access)
```sh
functionly deploy
```
it will create lambda functions and dynamoDB tables

# run in aws
```sh
aws lambda invoke --function-name CreateTodo-dev --payload file://./content/todoPayload.json --region us-east-1 `tty`
aws lambda invoke --function-name GetAllTodos-dev --region us-east-1 `tty`
```
