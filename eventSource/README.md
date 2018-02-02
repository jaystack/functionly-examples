# Event sources
this example works only in AWS

## event sources
- DynamoDB
- S3
- SNS
- Event
- (ApiGateway)


## define a source
```js
@dynamoTable({ tableName: '%ClassName%-table' })
export class Items extends DynamoDB { }
```
## subscribe to events
```js
@eventSource(Items)
export class CaptureDynamoEvent extends FunctionalService {
    public static async handle( @param dynamodb) {
        ...
    }
}
```
# parameter resolution
there are specific parameters for eventSource data
- DynamoDB => dynamodb
- SNS => Sns
- S3 => s3

example (you can rename your property):
```js
public static async handle( @param dynamodb) {}
public static async handle( @param('dynamodb') p1) {}
```
you can resolve deep object properties with param decorator
```js
public static async handle( @param('Sns.Subject') subject,  @param('Sns.Message') message) {}
```

# How to get original invoke parameters
there is an `event` decorator which return the original parameters
```js
public static async handle( @serviceParams rawData) {
    console.log(rawData.event)
    console.log(rawData.context)
}
```