const HttpClient = require('./rest-api/client')
const defaultErrorHandler = require('./rest-api/default-catch')
const restMappings = require('./rest-api/mappings')

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

		this.client = new HttpClient({
			baseURL: this.host
		})
		// this.client = axios.create({
		// 	baseURL: this.host,
		// 	transformResponse: [transformXML], // to JS Objects
		// })
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
		return new Promise((resolve, reject) => {
			const api = restMappings.container.create(name)
			this.client.request({
				method: api.method,
				url: this._url(api.suffix)
			}).then((res) => {
				resolve({
					status: res.status,
					statusText: res.statusText,
					containerName: name,
					headers: res.headers
				})
			})
			.catch((err) => defaultErrorHandler(err, reject))
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
		// console.log(`deleteContainer(${name})`)

		return new Promise((resolve, reject) => {
			const api = restMappings.container.delete(name)
			let opts = {
				method: api.method,
				url: this._url(api.suffix)
			}
			this.client.request(opts)
				.then((res) => {
					// console.log('delete response', res)
					// console.log(res.status) 201 == success
					// resolve(res.data)

					resolve({
						status: 202,
						statusText: 'Accepted',
						containerName: name
					})
				})
				.catch((err) => defaultErrorHandler(err, reject))
		})
	}

	/**
	 * Lists Containers and returns a `Promise` with either data or error object, including XML responses parsed into JavaScript object format.
	 *
	 * @returns {Promise}
	 */
	listContainers() {
		return new Promise((resolve, reject) => {
			const api = restMappings.container.list()
			let opts = {
				method: api.method,
				url: this._url(api.suffix)
			}

			this.client.request(opts)
				.then(function (res) {
					let containers = res.data.EnumerationResults.Containers.Container
					if (containers) {
						resolve(containers)
					} else {
						resolve (res.data)
					}
				})
				.catch((err) => defaultErrorHandler(err, reject))
		})
	}

	//-------- Helpers --------

	/**
	 * Formats URL for axios, adding sas if necessary
	 *
	 * @private
	 * @param {String} suffix
	 * @returns {String}
	 */
	_url (suffix) {
		let url = this.host + suffix
		url += (this.sas)
			? '&' + this.sas // Todo, check for '?'
			: ''

		return url
	}
}

module.exports = Blockport
