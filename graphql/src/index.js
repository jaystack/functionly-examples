import { FunctionalService, Service, DynamoTable, rest, param, injectable, inject, dynamo } from 'functionly';
import { graphql, buildSchema } from 'graphql';
import { generate } from 'shortid';

@injectable()
@dynamo()
export class TodoTable extends DynamoTable {}

// GraphQL schema
var schema = buildSchema(`
    type Query {
        todo(id: String!): Todo
        todos(status: String): [Todo]
	}
    type Mutation {
        createTodo(name: String, description: String, status: String): Todo
    }
    type Todo {
		id: String
		name: String
        description: String
        status: String
    }
`);

@injectable()
class GetTodo extends Service {
	static async handle(@param id, @inject(TodoTable) db) {
		return (await db.get({ Key: { id } })).Item;
	}
}

@injectable()
class GetTodoByStatus extends Service {
	static async handle(@param status, @inject(TodoTable) db) {
		return (await db.scan({
			FilterExpression: '#s = :status',
			ExpressionAttributeNames: { '#s': 'status' },
			ExpressionAttributeValues: { ':status': status }
		})).Items;
	}
}

@injectable()
class CreateTodo extends Service {
	static async handle(@param name, @param description, @param status, @inject(TodoTable) db) {
		let item = {
			id: generate(),
			name,
			description,
			status
		};
		await db.put({ Item: item });
		return item;
	}
}

@rest({ path: '/graphql', methods: [ 'post' ] })
class GraphQLTodoDB extends FunctionalService {
	static async handle(
		@param query,
		@param variables,
		@inject(GetTodo) todo,
		@inject(GetTodoByStatus) todos,
		@inject(CreateTodo) createTodo
	) {
		const root = {
			todo,
			todos,
			createTodo
		};

		return graphql(schema, query, root, undefined, variables);
	}
}

module.exports.graphQLTodoDB = GraphQLTodoDB.createInvoker();
