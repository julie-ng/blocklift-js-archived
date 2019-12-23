const HttpClient = require('./rest-api/client')
const defaultErrorHandler = require('./rest-api/default-catch')
const restMappings = require('./rest-api/mappings')

/**
 * Blocklift
 *
 * #### Example - List Container
 *
 * ```javascript
blocklift.listContainers()
	.then((data) => console.log(data))
	.catch((err) => console.error(err))
 * ```
 */
class Blocklift {

	/**
	 *
	 * @param {String} opts.serviceUrl - Blob Service URL, which can be Shared Access Signature (SAS) Url
	 */
	constructor (opts = {}) {
		if (opts.serviceUrl === undefined) {
			throw '`serviceUrl` required'
		}

		// this.serviceUrl = opts.serviceUrl
		// let parts = opts.serviceUrl.split('?')
		// this.host = parts[0]
		// this.sas = parts[1]
		// console.log('parts', parts)


		// let urlParams = new URLSearchParams(parts[1])
		// // console.log('sasParts', sasParts)
		// // for (let p of urlParams) {
		// // 	console.log(p)
		// // }

		// console.log('urlParams', urlParams)


		// this.client = new HttpClient(this.host, {
		// 	urlParams: urlParams
		// })

		this.client = new HttpClient({
			serviceUrl: opts.serviceUrl
		})
	}

	// -------- Containers --------

	/**
	 * Creates a new container
	 *
	 * Note: REST API returns empty body on success.
	 *
	 * @param {String} name - will be transformed to lowercase
	 * @returns {Promise}
	 */
	createContainer (name) {
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

	deleteContainer (name) {
		// console.log(`deleteContainer(${name})`)

		return new Promise((resolve, reject) => {
			const api = restMappings.container.delete(name)
			let opts = {
				method: api.method,
				url: this._url(api.suffix)
			}
			this.client.request(opts)
				.then((res) => {
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
	listContainers () {
		console.log('hello world')

		return new Promise((resolve, reject) => {
			const api = restMappings.container.list()
			// console.log('api', api)

			let opts = {
				method: api.method,
				params: api.params,
				url: api.path
				// url: this._url(api.suffix)
			}

			this.client.request(opts)
				.then(function (res) {
					// console.log('--------')
					// console.log(res)
					// console.log('--------')

					let containers = res.data.EnumerationResults.Containers.Container
					if (containers) {
						resolve(containers)
					} else {
						// console.log('--------')
						// console.log(res.request)
						// console.log('--------')
						resolve (res.data)
					}
				})
				.catch((err) => {
					console.log('----err----')
					console.log(err.request.path)
					console.log('--------')
					defaultErrorHandler(err, reject)
				})
		})
	}

	// -------- Blobs --------

	listBlobs (containerName = '') {
		return new Promise((resolve, reject) => {
			const api = restMappings.blob.list(containerName)
			let opts = {
				method: api.method,
				url: this._url(api.suffix)
			}
			this.client.request(opts)
				.then((res) => {
					const blobs = res.data.EnumerationResults.Blobs.Blob
					const result = blobs
						? blobs
						: res.data
					resolve(result)
				})
				.catch((err) => defaultErrorHandler(err, reject))
		})
	}

	// -------- Helpers --------

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

module.exports = Blocklift
