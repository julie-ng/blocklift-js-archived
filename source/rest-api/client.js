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
 * Custom HTTP client, configured for communicating with Azure Block Blob Storage API
 *
 * @private
 */
class HttpClient {

	/**
	 *
	 * Note: serviceUrl is required
	 *
	 * @param {Object} opts - options object
	 * @param {String} opts.serviceUrl - Blob Storage service URL
	 * @param {Integer} [opts.timeout=100000] - query string
	 * @param {URLSearchParams} opts.urlParams - query string
	 * @returns {axios instance}
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
