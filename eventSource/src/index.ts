import { generate } from 'shortid'

import { FunctionalService, DynamoDB, S3Storage, SimpleNotificationService } from 'functionly'
import { rest, description, param, injectable, inject, dynamoTable, eventSource, s3Storage, sns } from 'functionly'

@injectable
@dynamoTable({ tableName: '%ClassName%-table' })
export class EventStore extends DynamoDB { }


@injectable
@dynamoTable({ tableName: '%ClassName%-table' })
export class Items extends DynamoDB { }

@eventSource(Items)
export class CaptureDynamoEvent extends FunctionalService {
    public async handle( @param dynamodb, @inject(EventStore) events: EventStore) {
        await events.put({
            Item: {
                id: generate(),
                type: 'dynamo',
                event: dynamodb
            }
        })
    }
}

@injectable
@s3Storage({ bucketName: '%ClassName%-bucket' })
export class FileStorage extends S3Storage { }

@eventSource(FileStorage)
export class CaptureS3Event extends FunctionalService {
    public async handle( @param s3, @inject(EventStore) events: EventStore) {
        await events.put({
            Item: {
                id: generate(),
                type: 's3',
                event: s3
            }
        })
    }
}

@injectable
@sns({ topicName: '%ClassName%-sns' })
export class SNSEvents extends SimpleNotificationService { }

@eventSource(SNSEvents)
export class CaptureSNSEvent extends FunctionalService {
    public async handle( @param Sns, @inject(EventStore) events: EventStore) {
        await events.put({
            Item: {
                id: generate(),
                type: 'sns',
                event: Sns
            }
        })
    }
}



@rest({ path: '/createItem', anonymous: true })
export class CreateItem extends FunctionalService {
    public async handle(
        @param name,
        @inject(Items) items: Items,
        @inject(FileStorage) s3Files: FileStorage,
        @inject(SNSEvents) snsTopic: SNSEvents
    ) {
        const value = generate()
        await items.put({
            Item: {
                id: value,
                name
            }
        })

        await s3Files.putObject({
            Body: `my body ${name}`,
            Key: `test${value}.txt`
        })

        await snsTopic.publish({
            Message: `my message ${name}`,
            Subject: `my subject ${value}`
        })

        return { message: `hello ${name}` }
    }
}

export const createItem = CreateItem.createInvoker()
export const dynamoEvent = CaptureDynamoEvent.createInvoker()
export const s3Event = CaptureS3Event.createInvoker()
export const snsEvent = CaptureSNSEvent.createInvoker()
