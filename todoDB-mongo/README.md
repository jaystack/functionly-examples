# todoDB

## install and build
```sh
npm install
npm run build
```


# local mongo

create local mongodb with docker
```sh
docker run -d --name mongodb -p 27017:27017 mongodb
```

# run in local
```sh
npm start
```
or
```sh
npm run build
functionly local 3000 ./lib/todoDB.js
```
then test it
```sh
curl 'http://localhost:3000/createTodo?name=corpjs&description=corpjs-meetup&status=new'
curl 'http://localhost:3000/getAllTodos'
```



# deploy to aws (mongodb required)
create and setup your mongodb in aws and set the connection url in application
```sh
functionly deploy aws ./lib/todoDB.js --aws-region eu-central-1
```
or if you configured a functionly.json in your project root
```sh
functionly deploy
```
it will create lambda functions and dynamoDB tables

# run in aws
```sh
aws lambda invoke --function-name CreateTodo-example --payload file://./content/todoPayload.json --region eu-central-1 ./dist/corpjs && cat ./dist/corpjs
aws lambda invoke --function-name GetAllTodos-example --region eu-central-1 ./dist/corpjs && cat ./dist/corpjs
```
