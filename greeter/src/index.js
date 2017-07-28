import { FunctionalService } from 'functionly'
import { role, runtime, rest, param  } from 'functionly'

@rest({ path: '/hello' })
class Greeter extends FunctionalService {

    handle( @param name) {
        return { result: `Hello ${name}` }
    }

}

module.exports.greeter = Greeter.createInvoker()