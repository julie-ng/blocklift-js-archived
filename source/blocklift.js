const BlockBlob = require('./block-blob')
const HttpClient = require('./http/client')

const requestMappings = require('./http/api-mappings')
const responseTemplates = require('./http/response/templates')

/**
 * The Blocklift class is a wrapper around HTTP client, that formats raw Azure responses to be more developer friendly.
 * Blocklift always returns `Object`s instead of raw XML `String`s.
 *
 * For example list functions _always_ return `Array`s, even if there is only one result.
 *
 * @property {String|Boolean} [defaultContainer] - when specified, this is always prepended to Blob operations. Set to `false` if not set.
* @property {HttpClient} client - Http Cient used to make requests.
 */
class Blocklift {

	/**
	 * Constructor
	 *
	 * @param {String} opts.serviceUrl - Blob Service URL, which can be Shared Access Signature (SAS) Url
	 * @param {String} [opts.defaultContainer] - default container to use for Blob operations.
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
		const api = requestMappings.container.create(name)
		return this.client.request(api)
			.then((res) => {
				return {
					...res,
					containerName: name
				}
			})
			.catch((err) => err) // TODO: format again?
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
		const api = requestMappings.container.delete(name)
		return this.client.request(api)
			.then((res) => {
				return {
					...res,
					containerName: name
				}
			})
			.catch((err) => err)
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
		const api = requestMappings.container.list()
		return this.client.request(api)
			.then(function (res) {
				return {
					...res,
					containers: responseTemplates.listContainers(res)
				}
			})
			.catch((err) => err)
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
		const container = containerName || this.defaultContainer
		const api = requestMappings.blob.list(container)
		// console.log('api?', api)

		return this.client.request(api)
			.then((res) => {
				return {
					response: res,
					blobs: responseTemplates.listBlobs(res)
				}
			})
			.catch((err) => err)
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
		const blob = new BlockBlob(source, {
			container: this.defaultContainer,
			...params
		})
		const api = {
			...requestMappings.blob.create(),
			url: blob.url,
			headers: blob.headers,
			data: blob.file.body
		}

		return this.client.request(api)
			.then((res) => {
				return {
					blob: {
						...blob.template(),
						etag: res.headers.etag
					},
					response: res
				}
			})
			.catch((err) => err)
	}
}

module.exports = Blocklift
