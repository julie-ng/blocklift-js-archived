const axios = require('axios')
const chalk = require('chalk')

const _filterAxios = require('./responses/filter-axios.template')
const _errorTemplate = require('./responses/error.template')

const SASToken = require('./auth/sas-token')
const StorageRequest = require('./storage-request')
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
 * @property {String} account - Storage account name
 */
class HttpClient {

	/**
	 * Constructor
	 *
	 * Because of an axios bug that changes query param encoding, this custom client
	 * just appends SAS token as raw string to end of a URL.
	 *
	 * @param {Object} opts - options object
	 * @param {String} opts.serviceUrl - Blob Storage service URL, any query params attached are assumed to be the SAS token.
	 * @param {Integer} [opts.timeout=100000] - query string
	 * @returns {HttpClient}
	 */
	constructor (opts = {}) {
		this.sasToken = SASToken.extractFromUrl(opts.serviceUrl)

		const baseUrl = (new URL(opts.serviceUrl)).origin // + '/' // needs trailing slash?
		// create axios instance that is returned
		this.axios = axios.create({
			...defaultConfig,
			baseURL: baseUrl
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
	 * Makes HTTP Requests against Azure API, returning JavaScript objects instead of XML strings.
	 *
	 * @param {Object} opts - Object  with StorageRequest interface, i.e. includes `method`, `url`, `params`, `headers` and `data` properties.
	 * @param {String} opts.url - required URL (without host)
	 * @returns {Promise}	response frome server or error messages, with axios noise filtered out
	 */
	request (opts) {
		// console.log('client.request()', opts)
		const req = new StorageRequest(opts)

		if (this.sasToken) {
			req.append(this.sasToken)
		}
		// TODO: Add necessary authorization for `SharedKey` headers

		// Filter out axios noise from responses
		return new Promise((resolve, reject) => {
			this.axios.request(req)
				.then((response) => {
					resolve(_filterAxios(response))
				})
				.catch((err) => {
					reject(_errorTemplate(err))
				})
		})
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

	// TODO: strip SAS signature from logs, params: ss, srt, sp, sig
	// and replace with <redacted>
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
