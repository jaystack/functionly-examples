
aws lambda invoke --function-name CreateTodo-dev --payload file://./content/todoPayload.json --region us-east-1 /tmp/corpjs
aws lambda invoke --function-name GetAllTodos-dev --region us-east-1 /tmp/corpjs

curl -d "@content/todoPayload.json" -H "Content-Type: application/json" -X POST http://localhost:3000/createTodo
curl 'http://localhost:3000/getAllTodos'