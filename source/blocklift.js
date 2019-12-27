const BlockBlob = require('./block-blob')
const HttpClient = require('./http/client')
const defaultErrorHandler = require('./http/responses/default-catch')
const restMappings = require('./http/requests/mappings')

/**
 * The Blocklift class is a wrapper around HTTP client, that formats raw Azure responses to be more developer friendly.
 * Blocklift always returns `Object`s instead of raw XML `String`s.
 *
 * For example list functions _always_ return `Array`s, even if there is only one result.
 *
 * @property {String} [defaultContainer] - when specified, this is always prepended to Blob operations.
 */
class Blocklift {

	/**
	 * Constructor
	 *
	 * @param {String} opts.serviceUrl - Blob Service URL, which can be Shared Access Signature (SAS) Url
	 */
	constructor (opts = {}) {
		if (opts.serviceUrl === undefined) {
			throw '`serviceUrl` required'
		}

		this.defaultContainer = opts.defaultContainer || false

		this.client = new HttpClient(opts)
	}

	// -------- Containers --------

	/**
	 * Creates a new container
	 *
	 * Whereas the Azure REST API returns empty body on successful creation,
	 * the `createContainer('myname')` method returns the following response format:
	 *
	 * ```javascript
	 * {
	 * 	status: 201,
	 * 	statusText: Created,
	 * 	containerName: 'myname',
	 * 	headers: {…}
 	 * }
	 * ```
	 *
	 * where `headers` are the server response headers.
	 *
	 * @param {String} name - will be transformed to lowercase per Azure requirements
	 * @returns {Promise}
	 */
	createContainer (name) {
		name = name.toLowerCase()
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
	 * Lists all containers in your storage account (as determined by host name) and returns a `Promise` with either data or error object, including XML responses parsed into JavaScript object format.
	 *
   * @example
 	 *
	 * blocklift.listContainers()
	 *	.then((data) => console.log(data))
	 *	.catch((err) => console.error(err))
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

	/**
	 * List Blobs in a container or `defaultContainer` if none is provided.
	 *
	 * @param {String} [containerName]
	 * @return {Promise<Array>} list of blobs
	 * @return {Promise<Object>} Error
	 */
	listBlobs (containerName) {
		return new Promise((resolve, reject) => {
			const container = containerName || this.defaultContainer
			const api = restMappings.blob.list(container)
			this.client.request(api)
				.then((res) => {
					const blobs = res.data.EnumerationResults.Blobs.Blob
					let data = blobs
						? blobs
						: res.data

					// always return an Array
					if (blobs && !Array.isArray(data)) {
						data = [data]
					}
					resolve(data)
				})
				.catch((err) => defaultErrorHandler(err, reject))
		})
	}

	/**
	 * Upload Blob File
	 *
	 * @param {String} file - path to file
	 * @param {String} [params.container]
	 * @param {String} params.destination - without container name
	 * @param {*} [params.data]
	 */
	uploadFile (source, params = {}) {
		const container = params.container || this.defaultContainer
		const blob = new BlockBlob(source, {
			container: container
		})

		// console.log(blob)
		// const api = restMappings.blob.upload(filename)
		const api =  {
			method: 'PUT',
			path: blob.fullPath,
			headers: blob.headers,
			data: blob.file.body
		}

		return new Promise((resolve, reject) => {
			this.client.request(api)
				.then((res) => {
					resolve({
						...blob.getProperties(),
						etag: res.headers.etag
					})
				})
				.catch((err) => defaultErrorHandler(err, reject))
		})
	}
}

module.exports = Blocklift
