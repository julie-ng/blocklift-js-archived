const axios = require('axios')
const xmlParser = require('fast-xml-parser')

const restMappings = require('./http-api/mappings')

/**
 * Blockport
 *
 * #### Example - List Container
 *
 * ```javascript
blockport.listContainers()
	.then((data) => console.log(data))
	.catch((err) => console.error(err))
 * ```
 */
class Blockport {

	/**
	 *
	 * @param {String} opts.serviceUrl - Blob Service URL, which can be Shared Access Signature (SAS) Url
	 */
	constructor (opts = {}) {
		if (opts.serviceUrl === undefined) {
			throw '`serviceUrl` required'
		} else {
			this.serviceUrl = opts.serviceUrl
			let parts = opts.serviceUrl.split('?')
			this.host = parts[0]
			this.sas = parts[1]
		}
	}

	_url (suffix) {
		let url = this.host + suffix

		url += (this.sas)
			? '&' + this.sas // Todo, check for '?'
			: ''

		return url
	}
	/**
	 * Creates a new container
	 *
	 * Note: REST API returns empty body on success.
	 *
	 * @param {String} name - will be transformed to lowercase
	 * @returns {Promise}
	 */
	createContainer(name) {
		const api = restMappings.container.create(name)
		return new Promise((resolve, reject) => {
			axios.request({
				method: api.method,
				url: this._url(api.suffix)
			}).then((res) => {
				resolve(res.data)
			}).catch(function (err) {
				let data = err.response
					? formatError(err)
					: err
				reject(data)
			})
		})
	}

	/**
	 * Delete a container
	 *
	 * Note: does not support leasing
	 *
	 * @param {String} name - container name
	 * @returns {Promise}
	 */

	deleteContainer(name) {
		console.log(`deleteContainer(${name})`)

		const api = restMappings.container.delete(name)
		return new Promise((resolve, reject) => {
			axios.request({
				method: api.method,
				url: this._url(api.suffix)
			}).then((res) => {
				// console.log(res.status) 201 == success
				resolve(res.data)
			}).catch(function (err) {
				let data = err.response
					? formatError(err)
					: err
				reject(data)
			})
		})
	}

	/**
	 * Lists Containers and returns a `Promise` with either data or error object, including XML responses parsed into JavaScript object format.
	 *
	 * @returns {Promise}
	 */
	listContainers() {
		const listContainersUrl = this.serviceUrl + '&comp=list'

		return new Promise((resolve, reject) => {
			axios.get(listContainersUrl)
				.then(function (res) {
					let jsonObj = xmlParser.parse(res.data)
					let containers = jsonObj.EnumerationResults.Containers.Container
					// console.log(containers)
					resolve(containers)
				})
				.catch(function (err) {
					let data = err.response
						? formatError(err)
						: err
					reject(data)
				})
		})
	}
}

/**
 * @private
 * @param {Object} - Axios Error Object
 */
function formatError (err) {
	return {
		status: err.response.status,
		headers: err.response.headers,
		data: xmlParser.parse(err.response.data)
	}
}

module.exports = Blockport
