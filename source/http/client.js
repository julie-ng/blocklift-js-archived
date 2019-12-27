const axios = require('axios')
const chalk = require('chalk')
const URLString = require('./requests/url-string')
const transformXML = require('./responses/xml-helper')

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

		// request interceptors
		this.axios.interceptors.request.use(
			addRequestStartTime,
			(error) =>  Promise.reject(error)
		)

		// response interceptors
		this.axios.interceptors.response.use(
			logAllResponses,
			logAllErrors
		)

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
		let url = new URLString(api.path)

		if (api.params) {
			url.append(api.params)
		}

		if (this.sasToken) {
			url.append(this.sasToken)
		}

		// TODO
		// Add necessary authorization headers

		let opts = {
			method: api.method,
			url: url.url,
			data: api.data || ''
		}

		if (api.headers) {
			opts = {
				...opts,
				headers: api.headers
			}
		}

		return this.axios.request(opts)
	}
}

const log = function (msg) {
	console.log(chalk.blue(`[HttpClient] `) + msg)
}

function addRequestStartTime (config) {
	config.metadata = { startTime: new Date() }
	return config
}

function logAllResponses (response) {
	let metadata = response.config.metadata
	metadata.endTime = new Date()
	response.duration = metadata.endTime - metadata.startTime

	let req = response.request
	let server = `${req.agent.protocol}//${req.connection.servername}`

	log(
		req.method.toUpperCase()
		+ ' '
		+ server
		+ req.path
		+ ' ' + chalk.green(response.status) + ', ' + `${response.duration} ms`
	)
	return response
}

function logAllErrors (error) {
	let metadata = error.config.metadata
	metadata.endTime = new Date()
	error.duration = metadata.endTime - metadata.startTime

	console.log(chalk.bgRed.white(' HTTP Error ') + ' ' + chalk.red('[HttpClient] '))

	const obj = {
		status: error.response.status,
		statusText: error.response.statusText,
		request: {
			method: error.request.method,
			path: error.request.path
		}
	}
	console.log(obj)
	return Promise.reject(error)
}


module.exports = HttpClient
