/* eslint-disable no-prototype-builtins */
const SASToken = require('./sas-token')

const testToken = 'sv=2019-02-02&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-12-28T16:35:06Z&st=2019-12-28T08:35:06Z&spr=https&sig=WoKgH%2FjAcZNySamAMqw%2Bnd0h%2BVSGwXJbXsAlBRMfZIU%3D'
const testTokenParams = [
	'sv',
	'ss',
	'srt',
	'sp',
	'se',
	'st',
	'spr',
	'sig'
]

describe ('SASToken', () => {
	describe ('Constructor', () => {
		it ('sets a `token` property', () => {
			let sas = new SASToken(testToken)
			expect(sas.token).toEqual(testToken)
		})

		it ('saves each SAS param', () => {
			let sas = new SASToken(testToken)
			testTokenParams.forEach((param) => {
				expect(sas.hasOwnProperty(param)).toBe(true)
			})
		})

		it ('only stores SAS params', () => {
			let token = new SASToken(testToken + '&foo=bar')
			expect(token.hasOwnProperty('foo')).toBe(false)
		})
	})

	describe ('Static Methods', () => {
		describe ('hasToken()', () => {
			it ('checks if string includes required sas params', () => {
				expect(SASToken.hasToken(testToken)).toBe(true)
			})

			it ('checks if all required params are present', () => {
				expect(SASToken.hasToken(testToken.replace('sv=2019-02-02', ''))).toBe(false)
			})

			it ('checks loosely, ignoring non-token params', () => {
				expect(SASToken.hasToken('foo=bar&' + testToken + '&comp=list')).toBe(true)
			})
		})

		describe ('isToken()', () => {
			it ('checks if string is a token', () => {
				expect(SASToken.isToken(testToken)).toBe(true)
			})

			it ('checks if all required params are present', () => {
				expect(SASToken.isToken(testToken.replace('sv=2019-02-02', ''))).toBe(false)
			})

			it ('checks strictly, i.e. returns false with non-sas params', () => {
				expect(SASToken.isToken(testToken + '&sip=123')).toBe(true)
				expect(SASToken.isToken('foo=bar&' + testToken + '&comp=list')).toBe(false)
			})
		})

		describe ('isEqual()', () => {
			const testParams = [
				'sv=x',
				'sr=x',
				'se=x',
				'sp=x',
				'sig=x'
			]
			const token = testParams.join('&')

			it ('compares tokens', () => {
				expect(SASToken.isEqual(token, token)).toBe(true)
			})

			it ('takes extra params into account', () => {
				const withExtraParam = testParams
					.concat(['sip=1'])
					.join('&')
				expect(SASToken.isEqual(token, withExtraParam)).toBe(false)
			})

			it ('and ignores sort order', () => {
				const sortedButSame = [...testParams]
					.sort()
					.join('&')
				expect(SASToken.isEqual(token, sortedButSame)).toBe(true)
			})

			it ('compares values too', () => {
				const copy = [...testParams]
				copy[0] = 'sv=notx'
				copy[4] = 'sig=notx'
				expect(SASToken.isEqual(token, copy.join('&'))).toBe(false)
			})
		})

		describe ('extractFromUrl()', () => {
			const baseUrl = 'https://foo.blob.core.windows.net/mycontainer?'
			const token = 'sv=2019-02-02&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-12-29T03:23:39Z&st=2019-12-28T19:23:39Z&spr=https&sig=kxwGj9aHhWAeRqVEXw5kbG%2F5AP%2BqtN78cYyyERf0tlU%3D'
			// console.log(baseUrl + token)

			it ('extracts token from query param', () => {
				expect(SASToken.extractFromUrl(baseUrl + token)).toEqual(token)
			})

			it ('and ignores non-token params', () => {
				expect(SASToken.extractFromUrl(baseUrl + 'foo=bar&' + token + '&comp=list')).toEqual(token)
				expect(SASToken.extractFromUrl(baseUrl + token + '&comp=list')).toEqual(token)
			})
		})
	})
})