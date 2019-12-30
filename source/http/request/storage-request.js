const utils = require('../../utils')

/**
 * Encapsulates Azure specific requirements of REST API
 *
 * This class is used by the `HttpCient` class.
 * Main advantage over native classes, e.g. `URL` is that it allows
 * appending of SAS tokens as raw strings because `URLSearchParams`
 * types will encode and decode strings, which Azure does
 * not accept as valid for `sig` param.
 *
 * Additionally this class provides useful static methods
 * to extract account names `getAccountName()` and containers `getContainerName` and blob names from URL
 *
 * Example Request (note: only `url` is required)
 *
 * ```javascript
 * const request = new StorageRequest({
 * 	method: 'GET',
 * 	url: '/container/virtual-dir/hello.txt,
 * 	params: { snapshot: 123 },
 * 	headers: {
 * 		'Content-MD5': 'md5-hash',
 *		'Content-Type': 'text/plain'
 * 	},
 * 	data: 'Text body'
 * })
 * ```
 *
 * @private
 * @prop {String} url - url
 * @prop {String} [method = 'GET'] - request method
 * @prop {Object} [params = {}] - url query params
 * @prop {Object} [headers = {}] - http request headers
 * @prop {String|Object} [data = ''] - http request body
 */
class StorageRequest {

	/**
	 * Constructor
	 *
	 * Returns instance for chaining.
	 *
	 * @param {Object} req - HTTP request object
	 * @param {String} req.url - request url, generally without host. Include host to override `HttpClient` settings (not recommended).
	 * @param {String} [req.method = 'GET'] - request method
	 * @param {Object} [req.params = {}] - url query params, e.g. `{ id: 123 }`
	 * @param {Object} [req.headers = {}] - http request headers
	 * @return {StorageRequest} this - instance for chaining
	 */
	constructor (req = {}) {
		if (!utils.hasProperty(req, 'url')) {
			throw 'StorageRequest: missing required `url` param'
		}

		this.url = req.url
		this.method = req.method || 'GET'
		this.params = req.params || {}
		this.headers = req.headers || {}
		this.data = req.data || ''

		return this
	}

	/**
	 * Appends params to URL, in the form of a string `id=123` or  an object `{ id: 123 }`,
	 * adding `?` and `&` operators as needed.
	 *
	 * Useful for adding SAS Tokens.
	 *
	 * Returns instance for chaining.
	 *
	 * @param {String|Object} param - query parameter
	 * @return {StorageRequest}
	 */
	append (param) {
		let base = this.url
		base += _nextSeparator(base)

		if (typeof param === 'string') {
			base += param
		}

		if (_isPlainObject(param)) {
			base += (new URLSearchParams(param)).toString()
		}

		this.url = base

		return this
	}

	/**
	 * Adds Header, overwriting existing headers
	 *
	 * Returns instance for chaining.
	 *
	 * @param {Object} obj - http headers as key value pairs
	 * @return {StorageRequest}
	 */
	addHeader (obj) {
		this.headers = {
			...this.headers,
			...obj
		}

		return this
	}

	/**
	 * Extracts account name from host name URL in this pattern: `<account-name>.blob.core.windows.net`
	 *
	 * @param {String} url
	 * @return {String}
	 */
	static getAccountName (url) {
		// const regex = /(?<=http(s*):\/\/)(.*)(?=.blob.core.windows.net)/
		const u = new URL(url)
		return u.hostname
			.replace('.blob.core.windows.net', '')
			.replace('-secondary', '')
	}

	/**
	 * Extracts container name from host name URL, which is always root subdirectory, i.e. in this pattern: `https://<host>/<container-name>/…`
	 *
	 * @param {String} url
	 * @return {String}
	 */
	static getContainerName (url) {
		// const regex = /(blob.core.windows.net\/)(\w+)/
		const u = new URL(url)
		return (u.pathname === '/')
			? null
			: u.pathname.split('/')[1]
	}


	/**
	 * Extracts blob path name from full URL (including `https://`) and removes host and container name
	 *
	 * @param {String} fullUrl
	 * @return {String} blob path without host and without container name
	 */
	static getBlobpath (fullUrl) {
		// const regex = /(blob.core.windows.net\/)(\w+)/
		const u = new URL(fullUrl)
		const dirs = u.pathname.split('/')
		return (dirs.length >= 3 && dirs[2] !== '')
			? dirs[2]
			: null
	}
}

function _nextSeparator (url) {
	let c
	if (url.indexOf('?') === -1) {
		c = '?'
	} else if (!url.endsWith('?') && !url.endsWith('&')) {
		c = '&'
	} else {
		c = ''
	}
	return c
}

function _isPlainObject (obj) {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

module.exports = StorageRequest