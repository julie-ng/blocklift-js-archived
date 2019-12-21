const axios = require('axios')
const transformXML = require('./xml-helper')

/**
 * Custom HTTP client, configured for communicating with Azure Block Blob Storage API
 *
 * @private
 */
class HttpClient {

	/**
	 *
	 * @param {String} host
	 * @returns {axios}
	 */
	constructor(host) {
		const opts = {
			baseURL: this.host,

			// timeout in miliseconds
			timeout: 10000,

			// Azure returns XML but we want JavaScript Objects
			transformResponse: [transformXML],
		}

		this.client = axios.create(opts)

		return this.client
	}
}

module.exports = HttpClient