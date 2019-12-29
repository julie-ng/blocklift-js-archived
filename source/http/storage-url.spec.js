const StorageURL = require('./storage-url')

describe ('StorageURL', () => {
	describe ('Instance Methods', () => {
		describe ('append()', () => {
			let u

			beforeEach (() => {
				u = new StorageURL('base')
			})

			it ('does not introduce extra `?`', () => {
				let a = new StorageURL('base?')
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
				let a = new StorageURL('?comp=list')
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
					expect(StorageURL.getAccountName(toTest[url])).toEqual('myaccount')
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
					expect(StorageURL.getContainerName(url)).toEqual('mycontainer')
				})
			})

			it ('returns `null` if no container', () => {
				const url = 'https://foo.blob.core.windows.net/'
				expect(StorageURL.getContainerName(url)).toBe(null)
			})
		})

		describe ('getBlobpath()', () => {
			it ('extracts blob path name - without container', () => {
				const url = 'https://foo.blob.core.windows.net/mycontainer/foo.txt'
				expect(StorageURL.getBlobpath(url)).toEqual('foo.txt')
			})

			it ('returns `null` if no blob specified', () => {
				const host = 'https://foo.blob.core.windows.net/'
				expect(StorageURL.getBlobpath(host)).toBe(null)
				expect(StorageURL.getBlobpath(host + 'mycontainer/')).toBe(null)
			})
		})
	})
})