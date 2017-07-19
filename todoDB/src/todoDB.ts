import { generate } from 'shortid'

import { FunctionalService, FunctionalApi, annotations, DynamoDB } from 'functionly'
const { role, rest, environment, description, tag, aws, param, inject, injectable, log, dynamoTable } = annotations

@aws({ type: 'nodejs6.10', memorySize: 512, timeout: 3 })
export class TodoService extends FunctionalService { }


@injectable
@dynamoTable({ tableName: '%ClassName%_corpjs_functionly' })
export class TodoTable extends DynamoDB { }


@injectable
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


@injectable
@rest({ path: '/persistTodo', methods: ['post'] })
@description('persist Todo service')
export class PersistTodo extends TodoService {

    public async handle( @param name, @param description, @param status, @inject(TodoTable) db: DynamoDB) {

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
        @inject(TodoTable) db: DynamoDB
    ) {

        let items: any = await db.scan()

        return { ok1: 1, items }
    }

}

export const validateTodo = ValidateTodo.createInvoker()
export const persistTodo = PersistTodo.createInvoker()
export const createTodo = CreateTodo.createInvoker()
export const getAllTodos = GetAllTodos.createInvoker()
