import { generate } from 'shortid'

import { FunctionalService, DynamoTable, Service } from 'functionly'
import { rest, description, aws, param, inject, injectable, dynamo } from 'functionly'

@aws({ type: 'nodejs6.10', memorySize: 512, timeout: 3 })
export class TodoService extends FunctionalService { }


@injectable()
@dynamo()
export class TodoTable extends DynamoTable { }


@injectable()
export class ValidateTodo extends Service {
    static async handle( @param name, @param description, @param status) {
        const isValid = true
        return { isValid }
    }
}


@injectable()
export class PersistTodo extends Service {
    static async handle( @param name, @param description, @param status, @inject(TodoTable) db) {
        let item = {
            id: generate(),
            name,
            description,
            status
        }
        await db.put({ Item: item })
        return item
    }
}


@rest({ path: '/createTodo', methods: ['post'], anonymous: true, cors: true })
@description('create Todo service')
export class CreateTodo extends TodoService {
    static async handle( 
        @param name, 
        @param description, 
        @param status, 
        @inject(ValidateTodo) validateTodo,
        @inject(PersistTodo) persistTodo
    ) {
        let validateResult = await validateTodo({ name, description, status })
        if (!validateResult.isValid) {
            throw new Error('Todo validation error')
        }
        let persistTodoResult = await persistTodo({ name, description, status })
        return { ok: 1, persistTodoResult }
    }
}



@rest({ path: '/getAllTodos', cors: true, anonymous: true })
@description('get all Todo service')
export class GetAllTodos extends TodoService {
    static async handle(@inject(TodoTable) db) {
        let items = await db.scan()
        return { ok: 1, items }
    }
}

export const createTodo = CreateTodo.createInvoker()
export const getAllTodos = GetAllTodos.createInvoker()
