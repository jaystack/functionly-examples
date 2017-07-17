import { generate } from 'shortid'

import { FunctionalService, annotations, DynamoDB, S3Storage, SimpleNotificationService } from 'functionly'
const { rest, description, param, injectable, inject, dynamoTable, eventSource, s3Storage, sns } = annotations

@injectable
@dynamoTable({ tableName: '%ClassName%-table' })
export class EventStore extends DynamoDB { }


@injectable
@dynamoTable({ tableName: '%ClassName%-table' })
export class Items extends DynamoDB { }

@rest({ path: '/createItem', anonymous: true })
export class CreateItem extends FunctionalService {
    public async handle( @param name, @inject(Items) items: Items) {
        await items.put({
            Item: {
                id: generate(),
                name
            }
        })

        return { message: `hello ${name}` }
    }
}

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


export const createItem = CreateItem.createInvoker()
export const dynamoEvent = CaptureDynamoEvent.createInvoker()
export const s3Event = CaptureS3Event.createInvoker()
export const snsEvent = CaptureSNSEvent.createInvoker()
