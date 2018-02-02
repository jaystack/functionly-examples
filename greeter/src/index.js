import { FunctionalService, rest, param  } from 'functionly'

@rest({ path: '/hello' })
class Greeter extends FunctionalService {
    static async handle( @param name) {
        return { result: `Hello ${name}` }
    }
}

module.exports.greeter = Greeter.createInvoker()