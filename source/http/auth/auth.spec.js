const BlobAuth = require('./auth')

const exampleUrl = 'https://myaccount.blob.core.windows.net/'

describe ('BlobAuth', () => {

	describe ('Constructor', () => {
		it ('by default everything is null', () => {
			let auth = new BlobAuth()
			expect(auth.get('serviceUrl')).toEqual(null)
			expect(auth.get('account')).toBe(null)
			expect(auth.get('sharedKey')).toBe(null)
		})

		it ('accepts Blob Service URL with SAS', () => {
			let auth = new BlobAuth({
				serviceUrl: exampleUrl
			})
			expect(auth.getServiceUrl()).toEqual(exampleUrl)
			expect(auth.getAccount()).toBe(null)
			expect(auth.getSharedKey()).toBe(null)
			expect(auth.getType()).toEqual('serviceUrl')
		})

		it ('accepts account and shared access key', () => {
			let auth = new BlobAuth({
				account: 'myaccount',
				sharedKey: 'key1234=='
			})
			expect(auth.getServiceUrl()).toBe(null)
			expect(auth.getAccount()).toBe('myaccount')
			expect(auth.getSharedKey()).toBe('key1234==')
			expect(auth.getType()).toEqual('sharedKey')
		})
	})

	describe ('Setters', () => {
		let auth

		beforeEach(() => {
			auth = new BlobAuth({
				account: 'canttouchthis',
				sharedKey: 'mysharedkey'
			})
		})

		it ('has no setter function', () => {
			expect(() => auth.set('account', 'foo')).toThrow()
		})

		it ('cannot set `account` property', () => {
			auth.account = 'foo'
			expect(auth.get('account')).not.toEqual('foo')
			expect(auth.get('account')).toEqual('canttouchthis')
		})

		it ('cannot set `sharedKey` property', () => {
			auth.sharedKey = 'foo'
			expect(auth.get('sharedKey')).not.toEqual('foo')
			expect(auth.get('sharedKey')).toEqual('mysharedkey')
		})

		it ('cannot set `serviceUrl` property', () => {
			let auth = new BlobAuth({
				serviceUrl: 'example.com'
			})
			auth.serviceUrl = 'foo'
			expect(auth.get('serviceUrl')).not.toEqual('foo')
			expect(auth.get('serviceUrl')).toEqual('example.com')
			expect(auth.get('type')).toEqual('serviceUrl')
		})

		it ('cannot set `type` property', () => {
			auth.type = 'foo'
			expect(auth.get('type')).not.toEqual('foo')
			expect(auth.get('type')).toEqual('sharedKey')
		})
	})
})
