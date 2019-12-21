const axios = require('axios')
const transformXML = require('./xml.util')

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
		let client = axios.create({
			baseURL: this.host,

			// Azure returns XML but we want JavaScript Objects
			transformResponse: [transformXML],
		})

		return client
	}
}

module.exports = HttpClient