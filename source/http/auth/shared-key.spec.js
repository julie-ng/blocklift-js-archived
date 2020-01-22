const SharedKey = require('./shared-key')

describe ('SharedKey', () => {
	describe ('Constructor', () => {
		it ('has a constructor', () => {
			expect(() => {
				new SharedKey('accountname')
			}).not.toThrow()
		})
	})

	describe ('generate()', () => {
		const accountName = 'myaccount'
		it ('can do it', () => {
			const method = 'GET'
			const headers = {
				'x-ms-version': '2015-02-21',
				'x-ms-date': 'Fri, 26 Jun 2015 23:39:12 GMT'
			}
			const url = 'https://myaccount.blob.core.windows.net/mycontainer?comp=metadata&restype=container&timeout=20'

			const sharedKey = new SharedKey(accountName)
			const key = sharedKey.generate(method, headers, url)

			expect(key).toEqual('SharedKey myaccount:UkfGwd7vwnBLJyFP8SYflgLrl3j8y0NQTElj8KjidGw=') // will change if ACCESS KEY changes
		})
	})
})
