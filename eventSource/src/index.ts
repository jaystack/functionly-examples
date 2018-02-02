import { generate } from 'shortid'

import { FunctionalService, DynamoTable, S3Storage, SimpleNotificationService, CloudWatchEvent, Service } from 'functionly'
import { rest, description, param, injectable, inject, dynamo, eventSource, s3Storage, sns, cloudWatchEvent } from 'functionly'

@injectable()
@dynamo()
export class EventStore extends DynamoTable { }


@injectable()
@dynamo()
export class Items extends DynamoTable { }

@eventSource(Items)
export class CaptureDynamoEvent extends FunctionalService {
    public static async handle( @param dynamodb, @inject(EventStore) events: EventStore) {
        await events.put({
            Item: {
                id: generate(),
                type: 'dynamo',
                event: dynamodb
            }
        })
    }
}

@injectable()
@s3Storage()
export class FileStorage extends S3Storage { }

@eventSource(FileStorage)
export class CaptureS3Event extends FunctionalService {
    public static async handle( @param s3, @inject(EventStore) events: EventStore) {
        await events.put({
            Item: {
                id: generate(),
                type: 's3',
                event: s3
            }
        })
    }
}

@injectable()
@sns()
export class SNSEvents extends SimpleNotificationService { }

@eventSource(SNSEvents)
export class CaptureSNSEvent extends FunctionalService {
    public static async handle( @param Sns, @inject(EventStore) events: EventStore) {
        await events.put({
            Item: {
                id: generate(),
                type: 'sns',
                event: Sns
            }
        })
    }
}

@injectable()
@cloudWatchEvent({ scheduleExpression: 'rate(10 minutes)' })
export class TenMinutesSchedule extends CloudWatchEvent {}

@eventSource(TenMinutesSchedule)
export class CaptureScheduleEvent extends FunctionalService {
    public static async handle(@inject(EventStore) events: EventStore) {
        await events.put({
            Item: {
                id: generate(),
                type: 'timed event',
                event: {}
            }
        })
    }
}



@rest({ path: '/createItem', anonymous: true })
export class CreateItem extends FunctionalService {
    public static async handle(
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
export const scheduleEventEvent = CaptureScheduleEvent.createInvoker()
