const canonicalized = require('./canonicalized')

/**
 * Generates signature strings for authorization
 * against Azure Storage API when using Access keys.
 * For details, see [Azure Documentation](https://docs.microsoft.com/en-gb/rest/api/storageservices/authorize-with-shared-key)
 *
 * ```
 * Authorization: SharedKey myaccount:ctzMq410TV3wS7upTBcunJTDLEJwMAZuFPfr0mrrA08=
 * ```
 */
class SharedKey {
	/**
	 *
	 * @param {String} account - name of Azure Storage account
	 */
	constructor (account) {
		this.account = account
	}

	/**
	 * Generates signature for `Authorization` header
	 *
	 * @param {String} method - HTTP verb, e.g. `GET`, `PUT`, etc.
	 * @param {Object} headers - HTTP headers
	 * @param {String} url - full url incl. `https://`
	 * @return {String} - signature
	 */
	generate (method, headers, url) {
		const signature = _signatureTemplate(method, headers, url)
		return `Authorization: SharedKey ${this.account}:${signature}`
	}
}

// --- Helpers ---

const _signatureHeaders = [
	'Content-Encoding',
	'Content-Language',
	'Content-Length',
	'Content-MD5',
	'Content-Type',
	'Date',
	'If-Modified-Since',
	'If-Match',
	'If-None-Match',
	'If-Unmodified-Since',
	'Range',
]

const _signatureTemplate = function (method, headers, url) {

	// This part of signature is based on headers.
	// The following are optional ones that can be empty.
	// Order matters
	// "Where there is no header value, the new-line character only is specified."

	let result = method.toUpperCase() + '\n'
	// result += _appendSignature(headers, 'Content-Encoding')
	// result += _appendSignature(headers, 'Content-Language')
	// result += _appendSignature(headers, 'Content-Length')
	// result += _appendSignature(headers, 'Content-MD5')
	// result += _appendSignature(headers, 'Content-Type')
	// result += _appendSignature(headers, 'Date')
	// result += _appendSignature(headers, 'If-Modified-Since')
	// result += _appendSignature(headers, 'If-Match')
	// result += _appendSignature(headers, 'If-None-Match')
	// result += _appendSignature(headers, 'If-Unmodified-Since')
	// result += _appendSignature(headers, 'Range')

	_signatureHeaders.forEach((h) => {
		result += _appendSignature(headers, h)
	})

	result += canonicalized.header(headers)
	result += canonicalized.resource(url)
	return result
}


const _appendSignature = function (params, prop) {
	return (params[prop] === '')
		? '\n'
		: params[prop] + '\n'
}

module.exports = SharedKey