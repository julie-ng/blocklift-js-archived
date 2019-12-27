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

	describe ('resource()', () => {
		it ('can generate canonicalized URLs', () => {
			let example = resourceExamples.basic
			expect(canonicalized.resource(example.url)).toEqual(example.resource)
		})

		it ('and multiple values for params', () => {
			let example = resourceExamples.multipleParamValues
			expect(canonicalized.resource(example.url)).toEqual(example.resource)
		})

		it ('and secondary regions', () => {
			let example = resourceExamples.secondaries
			expect(canonicalized.resource(example.url)).toEqual(example.resource)
		})
	})
})

// Examples from Azure Docs
// https://docs.microsoft.com/en-gb/rest/api/storageservices/authorize-with-shared-key#shared-key-format-for-2009-09-19-and-later
const resourceExamples = {
	basic: {
		url: 'http://myaccount.blob.core.windows.net/mycontainer?restype=container&comp=metadata',
		resource: '/myaccount/mycontainer\ncomp:metadata\nrestype:container'
	},
	multipleParamValues: {
		url: 'http://myaccount.blob.core.windows.net/container?restype=container&comp=list&include=snapshots&include=metadata&include=uncommittedblobs',
		resource: '/myaccount/container\ncomp:list\ninclude:metadata,snapshots,uncommittedblobs\nrestype:container'
	},
	secondaries: {
		url: 'https://myaccount-secondary.blob.core.windows.net/mycontainer/myblob',
		resource: '/myaccount/mycontainer/myblob'
	}
}