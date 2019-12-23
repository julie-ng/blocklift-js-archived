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
			this.client.request(api)
				.then((res) => {
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
			this.client.request(api)
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
		return new Promise((resolve, reject) => {
			const api = restMappings.container.list()

			this.client.request(api)
				.then(function (res) {
					let containers = res.data.EnumerationResults.Containers.Container
					let data = (containers)
						? containers
						: res.data

					// always return an Array
					if (containers && !Array.isArray(data)) {
						data = [data]
					}
					resolve(data)
				})
				.catch(err => defaultErrorHandler(err, reject))
		})
	}

	// -------- Blobs --------

	listBlobs (containerName = '') {
		return new Promise((resolve, reject) => {
			const api = restMappings.blob.list(containerName)
			this.client.request(api)
				.then((res) => {
					const blobs = res.data.EnumerationResults.Blobs.Blob
					const data = blobs
						? blobs
						: res.data
					resolve(data)
				})
				.catch((err) => defaultErrorHandler(err, reject))
		})
	}
}

module.exports = Blocklift
