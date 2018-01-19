
aws lambda invoke --function-name CreateTodo-example --payload file://./content/todoPayload.json --region us-east-1 /tmp/corpjs
aws lambda invoke --function-name GetAllTodos-example --region us-east-1 /tmp/corpjs

curl 'http://localhost:3000/createTodo?name=corpjs&description=corpjs-meetup&status=new'
curl 'http://localhost:3000/getAllTodos'