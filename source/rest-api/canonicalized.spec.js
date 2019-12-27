// x-ms-date:Sat, 21 Feb 2015 00:48:38 GMT\nx-ms-version:2014-02-14\n

const canonicalized = require('./canonicalized')

describe ('canonicalized (Helper)', () => {

	describe('header()', () => {
		const expected = 'x-ms-date:Sat, 21 Feb 2015 00:48:38 GMT\nx-ms-version:2014-02-14\n'

		it ('can generate headers', () => {
			const hdr = {
				'x-ms-date': 'Sat, 21 Feb 2015 00:48:38 GMT',
				'x-ms-version': '2014-02-14'
			}
			expect(canonicalized.header(hdr)).toEqual(expected)
		})

		it ('and transforms header keys to lower case', () => {
			const malformed = {
				'X-MS-DATE': 'Sat, 21 Feb 2015 00:48:38 GMT',
				'x-ms-Version': '2014-02-14'
			}
			expect(canonicalized.header(malformed)).toEqual(expected)
		})

		it ('and ignores whitespace in header properties', () => {
			const malformed = {
				'  x-ms-date': 'Sat, 21 Feb 2015 00:48:38 GMT',
				' x-ms-version  ': '2014-02-14'
			}
			expect(canonicalized.header(malformed)).toEqual(expected)
		})

		it ('and removes double whitespaces (not inside quotes)', () => {
			const malformed = {
				'  x-ms-date': 'Sat, 21 Feb 2015   00:48:38 GMT',
				' x-ms-version  ': '2014-02-14   '
			}
			expect(canonicalized.header(malformed)).toEqual(expected)
		})

		it ('and keeps double whitespaces (inside quotes)', () => {
			const malformed = {
				'  x-ms-date': 'Sat, "21 Feb   2015"   00:48:38 GMT'
			}
			const cleaned = 'x-ms-date:Sat, "21 Feb   2015" 00:48:38 GMT\n'
			expect(canonicalized.header(malformed)).toEqual(cleaned)
		})

		it ('and ignores non `x-ms-` headers', () => {
			const hdr = {
				'foo': 'bar',
				'x-ms-date': 'Sat, 21 Feb 2015 00:48:38 GMT',
				'x-ms-version': '2014-02-14'
			}
			expect(canonicalized.header(hdr)).toEqual(expected)
		})
	})

	// describe ('resource()', () => {
	// 	it ()
	// })
})
