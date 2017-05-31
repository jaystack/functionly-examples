# todoDBAdvanced

first steppes based on [todoDb](https://github.com/jaystack/functionly-examples/tree/master/todoDB)

# class extensions
 
* [onHandle](#onhandle)
* [onInvoke](#oninvoke)
* [onInject](#oninject)
 
## onHandle

```js
export class GetAllTodos extends TodoService {

    ...

    // onHandle_${environment}
    // onHandle_aws
    // onHandle_local

    public async onHandle_aws(event, context, cb): Promise<any> {
        console.log('Hello onHandle_aws')
    }

    public async onHandle_local(req, res, next): Promise<any> {
        console.log('Hello onHandle_local')
    }
}
```
return any value if you want handle the result
```js
export class GetAllTodos extends TodoService {
    ...
    public async onHandle_local(req, res, next): Promise<any> {
        console.log('Hello onHandle_local')
        res.json({ ok1: 2 })
        return true
    }
}
```
`handle` function will not invoked in `local` environment



## onInvoke
```js
export class PersistTodo extends TodoService {
    ...
    public async onInvoke({ params, invokeConfig }): Promise<void> {
        console.log('onInvoke', params, invokeConfig)
    }


    // onInvoke_${environment}
    // onInvoke_aws
    // onInvoke_local

    // available parameters:
    // invokeParams, params, invokeConfig, parameterMapping, currentEnvironment, environmentMode 
    public async onInvoke_aws({ params }): Promise<void> {
        console.log('onInvoke_aws', params)
    }
}
```
 
## onInject
```js
export class TodoTable extends DynamoDB {

    public async onInject({ parameter }): Promise<void> {
        console.log('onInject', parameter)
    }

    public static async onInject({ parameter }): Promise<any> {
        console.log('onInject static', parameter)
    }
}
```
the static `onInject` method can return a value which will be injected, but then the instance level `onInject` will not be called