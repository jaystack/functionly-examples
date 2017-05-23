import { FunctionalService, annotations } from 'functionly'
const { role, runtime, apiGateway, param  } = annotations


@role("arn:aws:iam::856324650258:role/corpjs-functionly")
@runtime({ type: 'nodejs6.10', memorySize: 512, timeout: 3 })
@apiGateway({ path: '/hello' })
class Greeter extends FunctionalService {

    handle( @param name) {
        return { result: `Hello ${name}` }
    }

}

module.exports.greeter = Greeter.createInvoker()