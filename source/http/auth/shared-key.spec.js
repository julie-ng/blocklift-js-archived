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

			expect(key).toEqual('Authorization: SharedKey myaccount:ctzMq410TV3wS7upTBcunJTDLEJwMAZuFPfr0mrrA08=')
		})
	})
})


// /*

// GET\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:Fri, 26 Jun 2015 23:39:12 GMT\nx-ms-version:2015-02-21\n/myaccount/mycontainer\ncomp:metadata\nrestype:container\ntimeout:20


// GET\n /*HTTP Verb*/
// \n    /*Content-Encoding*/
// \n    /*Content-Language*/
// \n    /*Content-Length (empty string when zero)*/
// \n    /*Content-MD5*/
// \n    /*Content-Type*/
// \n    /*Date*/
// \n    /*If-Modified-Since */
// \n    /*If-Match*/
// \n    /*If-None-Match*/
// \n    /*If-Unmodified-Since*/
// \n    /*Range*/
// x-ms-date:Fri, 26 Jun 2015 23:39:12 GMT\nx-ms-version:2015-02-21\n    /*CanonicalizedHeaders*/
// /myaccount /mycontainer\ncomp:metadata\nrestype:container\ntimeout:20    /*CanonicalizedResource*/

// */