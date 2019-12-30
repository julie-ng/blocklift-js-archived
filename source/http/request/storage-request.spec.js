const StorageRequest = require('./storage-request')

describe ('StorageRequest', () => {
	const requiredParams = {
		url: '/foo'
	}

	describe ('Constructor', () => {

		it ('throws without required url property', () => {
			expect(() => {
				new StorageRequest()
			}).toThrow('StorageRequest: missing required `url` param')
		})

		it ('returns instance, to be chainable', () => {
			expect((new StorageRequest(requiredParams)) instanceof StorageRequest).toBe(true)
		})

		describe ('Defaults', () => {
			let defaultRequest

			beforeEach (() => {
				defaultRequest = new StorageRequest (requiredParams)
			})

			it ('defaults `method` to get', () => {
				expect(defaultRequest.method).toEqual('GET')
			})

			it ('defaults `headers` to empty obj', () => {
				expect(defaultRequest.headers).toEqual({})
			})

			it ('defaults `params` to empty obj', () => {
				expect(defaultRequest.params).toEqual({})
			})

			it ('defaults `data` to empty string', () => {
				expect(defaultRequest.data).toEqual('')
			})
		})

		it ('accepts `method` params', () => {
			const s = new StorageRequest({
				...requiredParams,
				method: 'PUT'
			})
			expect(s.method).toEqual('PUT')
		})

		it ('accepts `headers` params', () => {
			const s = new StorageRequest({
				...requiredParams,
				headers: {
					foo: 'bar'
				}
			})
			expect(s.headers).toEqual({ foo: 'bar' })
		})

		it ('accepts `params` params', () => {
			const s = new StorageRequest({
				...requiredParams,
				params: {
					id: 123
				}
			})
			expect(s.params).toEqual({ id: 123 })
		})

		it ('accepts `data` param as string', () => {
			const s = new StorageRequest({
				...requiredParams,
				data: 'mystring'
			})
			expect(s.data).toEqual('mystring')
		})

		it ('accepts `data` param as Buffer', () => {
			const buffer = new Buffer('mybuffer')
			const s = new StorageRequest({
				...requiredParams,
				data: buffer
			})
			expect(s.data).toEqual(buffer)
		})
	})

	describe ('Instance Methods', () => {
		describe ('addHeader()', () => {
			it ('can append headers', () => {
				const s = new StorageRequest(requiredParams)
				const hdr = {
					'Accepts': 'application/json'
				}
				expect(s.headers).toEqual({})
				s.addHeader(hdr)
				expect(s.headers).toEqual(hdr)
			})

			it ('returns self to be chainable', () => {
				const s = new StorageRequest(requiredParams)
				expect(s.addHeader({ foo: 'bar' }) instanceof StorageRequest).toBe(true)
			})
		})

		describe ('append()', () => {
			let u

			beforeEach (() => {
				u = new StorageRequest({
					url: 'base'
				})
			})

			it ('does not introduce extra `?`', () => {
				let a = new StorageRequest({
					url: 'base?'
				})
				a.append('id=1')
				expect(a.url).toEqual('base?id=1')
			})

			it ('can append strings', () => {
				u.append('a=b')
				expect(u.url).toEqual('base?a=b')
			})

			it ('can append objects', () => {
				u.append({
					c: 'd'
				})
				expect(u.url).toEqual('base?c=d')
			})

			it ('can append multiple times', () => {
				u.append('a=b')
				u.append('c=d')
				expect(u.url).toEqual('base?a=b&c=d')
			})

			it ('can base chained', () => {
				u.append('a=b').append('c=d')
				expect(u.url).toEqual('base?a=b&c=d')
			})

			it ('can add token', () => {
				let a = new StorageRequest({
					url: '?comp=list'
				})
				a.append('a=b&c=d')
				expect(a.url).toEqual('?comp=list&a=b&c=d')
			})
		})
	})

	describe ('Static Methods', () => {

		describe ('getAccountName()', () => {
			it ('extracts account name from url', () => {
				const toTest = {
					https: 'https://myaccount.blob.core.windows.net/',
					noTrailingSlash: 'https://myaccount.blob.core.windows.net',
					http: 'http://myaccount.blob.core.windows.net/',
					secondaryRegion: 'https://myaccount-secondary.blob.core.windows.net/?sv=2019-02-02'
				}

				for (const url in toTest) {
					expect(StorageRequest.getAccountName(toTest[url])).toEqual('myaccount')
				}
			})
		})

		describe ('getContainerName()', () => {
			it ('extracts container name from url', () => {
				const matches = [
					'https://foo.blob.core.windows.net/mycontainer',
					'https://foo.blob.core.windows.net/mycontainer?foo=bar',
					'https://foo.blob.core.windows.net/mycontainer/?foo',
					'https://foo.blob.core.windows.net/mycontainer/blob'
				]

				matches.forEach((url) => {
					expect(StorageRequest.getContainerName(url)).toEqual('mycontainer')
				})
			})

			it ('returns `null` if no container', () => {
				const url = 'https://foo.blob.core.windows.net/'
				expect(StorageRequest.getContainerName(url)).toBe(null)
			})
		})

		describe ('getBlobpath()', () => {
			it ('extracts blob path name - without container', () => {
				const url = 'https://foo.blob.core.windows.net/mycontainer/foo.txt'
				expect(StorageRequest.getBlobpath(url)).toEqual('foo.txt')
			})

			it ('returns `null` if no blob specified', () => {
				const host = 'https://foo.blob.core.windows.net/'
				expect(StorageRequest.getBlobpath(host)).toBe(null)
				expect(StorageRequest.getBlobpath(host + 'mycontainer/')).toBe(null)
			})
		})
	})
})