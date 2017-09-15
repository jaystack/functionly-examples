import { generate } from 'shortid'

import { FunctionalService, MongoCollection, NoCallbackWaitsForEmptyEventLoop } from 'functionly'
import { role, rest, environment, description, tag, aws, param, inject, injectable, log, mongoCollection, mongoConnection, serviceParams, request, use } from 'functionly'

@aws({ type: 'nodejs6.10', memorySize: 512, timeout: 3 })
@use(NoCallbackWaitsForEmptyEventLoop)
export class TodoService extends FunctionalService { }

@injectable()
@mongoConnection('mongodb://localhost:27017/tododb')
@mongoCollection({ collectionName: '%ClassName%_corpjs_functionly' })
export class TodoTable extends MongoCollection { }


@injectable()
@rest({ path: '/validateTodo', methods: ['post'] })
@description('validate Todo service')
export class ValidateTodo extends TodoService {

    public async handle( @param name, @param description, @param status) {
        const isValid = true

        return { isValid }
    }

    public async invoke(params: { name: string, description: string, status: string }) {
        return await super.invoke(params)
    }
}


@injectable()
@rest({ path: '/persistTodo', methods: ['post'] })
@description('persist Todo service')
export class PersistTodo extends TodoService {

    public async handle( @param name, @param description, @param status, @inject(TodoTable) db: any) {

        let item = {
            _id: generate(),
            name,
            description,
            status
        }

        await db.insertOne(item)

        return item
    }
}


@rest({ path: '/createTodo', anonymous: true })
@description('create Todo service')
export class CreateTodo extends TodoService {

    public async handle( @param name, @param description, @param status, @inject(ValidateTodo) validateTodo: ValidateTodo,
        @inject(PersistTodo) persistTodo: PersistTodo
    ) {

        let validateResult = await validateTodo.invoke({ name, description, status })
        if (!validateResult.isValid) {
            throw new Error('Todo validation error')
        }

        let persistTodoResult = await persistTodo.invoke({ name, description, status })

        return { ok: 1, persistTodoResult }
    }

}



@rest({ path: '/getAllTodos', cors: true, anonymous: true })
@description('get all Todo service')
export class GetAllTodos extends TodoService {

    public async handle(
        @inject(TodoTable) db: TodoTable
    ) {

        let items: any = await db.find().toArray()

        return { ok1: 1, items }
    }

}

export const validateTodo = ValidateTodo.createInvoker()
export const persistTodo = PersistTodo.createInvoker()
export const createTodo = CreateTodo.createInvoker()
export const getAllTodos = GetAllTodos.createInvoker()
