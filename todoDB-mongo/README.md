# todoDB

## install and build
```sh
npm install
```


# local mongo

create local mongodb with docker
```sh
docker run -d --name mongodb -p 27017:27017 mongodb
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

# aws requirements
```js
import { NoCallbackWaitsForEmptyEventLoop } from 'functionly'

@use(NoCallbackWaitsForEmptyEventLoop)
export class TodoService extends FunctionalService { }
```
allows a Lambda function to return its result without close the database connection

# deploy to aws (mongodb required)
create and setup your mongodb in aws and set the connection url in application
```sh
functionly deploy
```
it will create lambda functions and dynamoDB tables

# run in aws
```sh
aws lambda invoke --function-name CreateTodo-dev --payload file://./content/todoPayload.json --region us-east-1 `tty`
aws lambda invoke --function-name GetAllTodos-dev --region us-east-1 `tty`
```
