const axios = require('axios')
const transformXML = require('./xml-helper')


const defaultConfig = {
	// timeout in miliseconds
	timeout: 10000,

	// Azure returns XML but we want JavaScript Objects
	transformResponse: [transformXML],

	paramsSerializer: function (params) {
		// return Qs.stringify(params, {arrayFormat: 'brackets'})

		console.log("don't serialize")
		console.log(params)

		return params
  }
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
		const host = parts[0]
		const sas = parts[1]
		// console.log('parts', parts)

		this.host = parts[0]

		if (parts[1].length > 0) {
			this.sasToken = parts[1]
		} else {
			this.sasToken = false
		}

		// create axios instance that is returned
		this.client = axios.create({
			...defaultConfig,
			baseURL: this.host
		})

		// setting default params in config does not work
		// see https://github.com/axios/axios/issues/1476
		// So we inject them using interceptors instead
		setDefaultRequestParams(this)

		// Finally return axios instance
		return this.client
	}
}

function setDefaultRequestParams(self) {
	self.client.interceptors.request.use((config) => {
		console.log('interceptor config', config)


		// todo: move to a helper for test
		if (self.sasToken) {
			let tokenPairs = self.sasToken.split('&')
			let tokenParams = {}
			console.log('tokenParams', tokenParams);

			tokenPairs.forEach((pair) => {
				let p = pair.split('=')
				tokenParams[p[0]] = p[1]
			})

			config.params = new URLSearchParams({
				...tokenParams,
				...config.params
			})
		}

		// still correct here :-/
		console.log('config.params', config.params)

		return config
	})

	return true
}

module.exports = HttpClient