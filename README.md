# blocklift

A dead simple and developer friendly JavaScript library for handline object storage on Azure

## Examples

### List Containers

```javascript
blocklift.listContainers()
	.then((data) => console.log(data))
	.catch((err) => console.error(err))
```

## Responses

### Errors

Errors are `Object`s with the following attributes:

- `status` - HTTP status code (non 2xx)
- `headers` - Response Headers
- `data` - Response Body parsed from XML to JavaScript object

#### Example

```javascript
{
	status: 403,
	headers: {
		'content-length': '544',
		'content-type': 'application/xml',
		server: 'Microsoft-HTTPAPI/2.0',
		'x-ms-request-id': 'a61c5522-e01e-001f-1873-b6530e000000',
		'x-ms-error-code': 'AuthenticationFailed',
		date: 'Thu, 19 Dec 2019 13:54:42 GMT',
		connection: 'close'
	},
	data: {
		Error: {
			Code: 'AuthenticationFailed',
			Message: 'Server failed to authenticate the request. Make sure the value of Authorization header is formed correctly including the signature.\n' +
				'RequestId:a61c5522-e01e-001f-1873-b6530e000000\n' +
				'Time:2019-12-19T13:54:43.5404807Z',
			AuthenticationErrorDetail: 'Signature not valid in the specified time frame: Start [Wed, 18 Dec 2019 14:25:14 GMT] - Expiry [Wed, 18 Dec 2019 22:25:14 GMT] - Current [Thu, 19 Dec 2019 13:54:43 GMT]'
		}
	}
}
```
