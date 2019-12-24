const axios = require('axios')
const URL = require('./url')
const transformXML = require('./xml-helper')

const defaultConfig = {
	// timeout in miliseconds
	timeout: 10000,

	// Azure returns XML but we want JavaScript Objects
	transformResponse: [transformXML]
}

/**
 * Custom HTTP client,
 * configured for communicating with Azure Block Blob Storage API
 *
 * @private
 * @property {axios} axios - axios instance with preconfigured defaults used to make requests
 */
class HttpClient {

	/**
	 * Constructor
	 *
	 * Because of an axios bug that changes query param encoding, this custom client
	 * just appends SAS token to end of a URL. This is a temporary compromise.
	 *
	 * @param {Object} opts - options object
	 * @param {String} opts.serviceUrl - Blob Storage service URL, any query params attached are assumed to be the SAS token.
	 * @param {Integer} [opts.timeout=100000] - query string
	 * @returns {HttpClient}
	 */
	constructor (opts = {}) {
		let parts = opts.serviceUrl.split('?')
		this.host = parts[0]

		if (parts[1].length > 0) {
			this.sasToken = parts[1]
		} else {
			this.sasToken = false
		}

		// create axios instance that is returned
		this.axios = axios.create({
			...defaultConfig,
			baseURL: this.host
		})

		return this
	}

	/**
	 * Makes HTTP Requests
	 *
	 * @param {Object} api - options object
	 * @param {String} api.method - HTTP method, e.g. GET, PUT, DELETE
	 * @param {String} api.path - HTTP path without host to send the request
	 * @param {String|Object} api.params - optional params
	 */
	request (api) {
		let url = new URL(api.path)

		if (api.params) {
			url.append(api.params)
		}

		if (this.sasToken) {
			url.append(this.sasToken)
		}

		return this.axios.request({
			method: api.method,
			url: url.url
		})
	}
}

module.exports = HttpClient
