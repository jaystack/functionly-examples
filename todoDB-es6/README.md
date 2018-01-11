# todoDB-es6

## install
```sh
npm install
```


# deploy to local

create local dynamoDB with docker
```sh
docker run -d --name dynamodb -p 8000:8000 peopleperhour/dynamodb
```
local deploy will create your tables in dynamoDB

```sh
functionly deploy local
```

# run in local
```sh
npm start
```
or
```sh
functionly local
```
then test it
```sh
curl 'http://localhost:3000/createTodo?name=corpjs&description=corpjs-meetup&status=new'
curl 'http://localhost:3000/getAllTodos'
```



# deploy to aws
create and setup your AWS IAM role (Lambda execution, dynamo table access) \
```sh
functionly deploy
```
it will create lambda functions and dynamoDB tables

# run in aws
```sh
aws lambda invoke --function-name CreateTodo --payload file://./content/todoPayload.json --region eu-central-1 ./dist/corpjs && cat ./dist/corpjs
aws lambda invoke --function-name GetAllTodos --region eu-central-1 ./dist/corpjs && cat ./dist/corpjs
```
