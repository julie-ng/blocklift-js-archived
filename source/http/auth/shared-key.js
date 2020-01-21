require('dotenv').config()
const crypto = require('crypto')
const canonicalized = require('./canonicalized')
const utils = require('../../utils')
const accountKey = process.env.BLOB_ACCOUNT_KEY

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
		const str = _signatureTemplate(method, headers, url)

		// console.log('str')
		// console.log(str)

		const utf8String = (new Buffer(str)).toString('utf8')

		// const utf8String = `GET


		// const utf8String = "GET\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:Fri, 26 Jun 2015 23:39:12 GMT\nx-ms-version:2015-02-21\n/myaccount/mycontainer\ncomp:metadata\nrestype:container\ntimeout:20"

		const decodedKey = (new Buffer(accountKey, 'base64')).toString('utf8')
		const hmac = crypto.createHmac('sha256', decodedKey)
		// Signature=Base64(HMAC-SHA256(UTF8(StringToSign), Base64.decode(<your_azure_storage_account_shared_key>)))
		const signature = hmac.update(utf8String).digest('base64')
		return `SharedKey ${this.account}:${signature}`
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
	console.log('_signatureTemplate()', method, url, headers)

	// This part of signature is based on headers.
	// The following are optional ones that can be empty.
	// Order matters
	// "Where there is no header value, the new-line character only is specified."

	let result = method.toUpperCase() + '\n'

	_signatureHeaders.forEach((h) => {
		result += _appendSignature(headers, h)
	})

	result += canonicalized.header(headers)
	result += canonicalized.resource(url)
	return result
}


const _appendSignature = function (params, prop) {
	// console.log('_appendSignature()', prop, params)
	return (utils.hasProperty(params, prop) && params[prop] !== '')
		? params[prop] + '\n'
		: '\n'
}

module.exports = SharedKey