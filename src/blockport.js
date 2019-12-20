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

	/**
	 * Creates a new container
	 *
	 * Note: REST API returns empty body on success.
	 *
	 * @param {String} name - will be transformed to lowercase
	 * @returns {Promise} - axios object
	 */
	createContainer(name) {
		const api = restMappings.container.create(name)

		let url = this.host + api.suffix
		url += (this.sas)
			? '&' + this.sas // Todo, check for '?'
			: ''

		return new Promise((resolve, reject) => {
			axios.request({
				method: api.method,
				url: url
			}).then((res) => {
				// console.log(res.status) 201 == success
				resolve(res.data)
				// let jsonObj = xmlParser.parse(res.data)
				// let containers = jsonObj.EnumerationResults.Containers.Container
			}).catch(function (err) {
				let data = err.response
					? errorResponse(err)
					: err
				reject(data)
			})
		})
	}

	/**
	 * Lists Containers and returns a `Promise` with either data or error object, including XML responses parsed into JavaScript object format.
	 *
	 * #### Example Response (Success)
	 *
	 * ```javascript
[
  {
    Name: 'container-one',
    Properties: {
      'Last-Modified': 'Wed, 18 Dec 2019 15:33:35 GMT',
      Etag: '"0x8D783CFA53E3733"',
      LeaseStatus: 'unlocked',
      LeaseState: 'available',
      PublicAccess: 'container',
      DefaultEncryptionScope: '$account-encryption-key',
      DenyEncryptionScopeOverride: false,
      HasImmutabilityPolicy: false,
      HasLegalHold: false
    }
  },
  {
    Name: 'container-two',
    Properties: {
      'Last-Modified': 'Wed, 18 Dec 2019 09:42:48 GMT',
      Etag: '"0x8D7839EA4D4623D"',
      LeaseStatus: 'unlocked',
      LeaseState: 'available',
      PublicAccess: 'blob',
      DefaultEncryptionScope: '$account-encryption-key',
      DenyEncryptionScopeOverride: false,
      HasImmutabilityPolicy: false,
      HasLegalHold: false
    }
  }
]
	 * ```
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
					console.log(containers)
					resolve(containers)
				})
				.catch(function (err) {
					let data = err.response
						? errorResponse(err)
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
function errorResponse (err) {
	return {
		status: err.response.status,
		headers: err.response.headers,
		data: xmlParser.parse(err.response.data)
	}
}

module.exports = Blockport
