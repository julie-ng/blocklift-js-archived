# Blocklift.js

A dead simple and developer friendly JavaScript library for handling object storage on Azure.

## Examples

### List Containers

```javascript
blocklift.listContainers()
	.then((data) => console.log(data))
	.catch((err) => console.error(err))
```

## Azure API Responses, Formats 

### Container Created

```javascript
{
	status: 202,
	statusText: 'Accepted',
	headers: {
		'content-length': '0',
		server: 'Windows-Azure-Blob/1.0 Microsoft-HTTPAPI/2.0',
		'x-ms-request-id': 'bd8377df-f01e-005e-4732-be0bea000000',
		'x-ms-version': '2019-02-02',
		date: 'Sun, 29 Dec 2019 10:29:51 GMT',
		connection: 'close'
	},
	data: '',
	containerName: 'integration-725'
}
```

### List Containers

```javascript
res {
	status: 200,
	statusText: 'OK',
	headers: {
		'transfer-encoding': 'chunked',
		'content-type': 'application/xml',
		server: 'Windows-Azure-Blob/1.0 Microsoft-HTTPAPI/2.0',
		'x-ms-request-id': 'f8af9a78-d01e-002b-5832-be60c6000000',
		'x-ms-version': '2019-02-02',
		date: 'Sun, 29 Dec 2019 10:28:42 GMT',
		connection: 'close'
	},
	data: {
		containers: [
			[Object], [Object],
			[Object], [Object],
			[Object], [Object],
			[Object], [Object]
		]
	}
}
```

### Blob Properties

```javascript
{
	Name: 'hello.txt',
	Properties: {
		'Creation-Time': 'Wed, 25 Dec 2019 22:30:47 GMT',
		'Last-Modified': 'Wed, 25 Dec 2019 23:02:03 GMT',
		Etag: 637129117234621600,
		'Content-Length': 11,
		'Content-Type': 'text/plain',
		'Content-Encoding': '',
		'Content-Language': '',
		'Content-CRC64': '',
		'Content-MD5': 'sQqNsWTgdUEFt6mb5y4/5Q==',
		'Cache-Control': '',
		'Content-Disposition': '',
		BlobType: 'BlockBlob',
		AccessTier: 'Hot',
		AccessTierChangeTime: 'Wed, 25 Dec 2019 23:02:03 GMT',
		LeaseStatus: 'unlocked',
		ServerEncrypted: true
	}
}
```

### Blob Created

```javascript
{
	blob: {
		container: 'blocklift-test',
		path: 'integration/hello-integration-248.txt',
		pathname: 'blocklift-test/integration/hello-integration-248.txt',
		contentType: 'text/plain',
		md5: 'xIVzWDiwBXV/PzGZUAwOyg==',
		etag: '"0x8D78C4A5996E1B0"'
	},
	response: {
		status: 201,
		statusText: 'Created',
		headers: {
			'content-length': '0',
			'content-md5': 'xIVzWDiwBXV/PzGZUAwOyg==',
			'last-modified': 'Sun, 29 Dec 2019 10:32:05 GMT',
			etag: '"0x8D78C4A5996E1B0"',
			server: 'Windows-Azure-Blob/1.0 Microsoft-HTTPAPI/2.0',
			'x-ms-request-id': '4a03a68b-701e-001d-7233-beedb6000000',
			'x-ms-version': '2019-02-02',
			'x-ms-content-crc64': 'awyymjQimGI=',
			'x-ms-request-server-encrypted': 'true',
			date: 'Sun, 29 Dec 2019 10:32:04 GMT',
			connection: 'close'
		}
	}
}
```

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
