# greeter

## install and build
```sh
npm install
npm run build
```
# run in local
```sh
npm start
```
or
```sh
npm run build
functionly local
```
then test it
```sh
curl 'http://localhost:3000/hello?name=world'
```



# deploy to aws
create and setup your AWS IAM role (Lambda execution) \
```sh
functionly deploy aws ./lib/index.js --aws-region us-east-1
```
or if you configured a functionly.json in your project root
```sh
functionly deploy
```
