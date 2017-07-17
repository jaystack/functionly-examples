import { FunctionalService, annotations } from 'functionly'
const { role, runtime, rest, param  } = annotations

@rest({ path: '/hello' })
class Greeter extends FunctionalService {

    handle( @param name) {
        return { result: `Hello ${name}` }
    }

}

module.exports.greeter = Greeter.createInvoker()