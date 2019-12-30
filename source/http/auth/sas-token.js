const queryParams = require('./sas-params')
const utils = require('./../../utils')

/**
 * Service Access Signature (SAS) Token
 *
 * For reference, properties are listed here as documented in
 * https://docs.microsoft.com/en-us/rest/api/storageservices/create-service-sas
 *
 *
 * @prop {String} sv - The `signedversion` (sv) field contains the service version of the shared access signature. Example: `2019-02-02`
 * @prop {String} ss - `signedservice`. Example: `bfqt`
 * @prop {String} srt - `signedresourcetype`. Example: `sco`
 * @prop {String} sp - Signed Permission `signedpermissions` indicating permission restrictions. Example: `rwdlacup`
 * @prop {String} [se = ''] - Optional signed Expirary in UTC time as  ISO 8601 format. Example: `2019-12-29T03:23:39Z`
 * @prop {String} [st = ''] - Optional signed Start in UTC time as  ISO 8601 format. Example: `2019-12-28T19:23:39Z`
 * @prop {String} [spr = 'https'] - Optional signed protocol (spr). Example: `https`
 * @prop {String} sig - Example: `kxwGj9aHhWAeRqVEXw5kbG/5AP+qtN78cYyyERf0tlU`
 */
class SASToken {

	/**
	 * @param {String} sasToken extracted from URL
	 */
	constructor (sasToken) {
		this.token = sasToken
		sasToken
			.split('&')
			.forEach((prop) => {
				const keyval = prop.split('=')
				if (utils.hasProperty(queryParams.all, keyval[0])) {
					this[keyval[0]] = keyval[1]
				}
			})
	}

	/**
	 * Returns token string
	 *
	 * @return {String} token
	 */
	toString () {
		return this.token
	}

	static hasToken (url) {
		const requiredParams = queryParams.required
		const params = new URLSearchParams(url)
		for (const i in requiredParams) {
			if (!params.has(requiredParams[i])) {
				return false
			}
		}
		return true
	}

	static extractFromUrl (url) {
		const params = (new URL(url)).search
			.slice(1) // remove leading `?`
			.split('&')
		let token = ''
		let required = []

		params.forEach((param) => {
			const p = param.split('=')
			const key = p[0]
			const val = p[1]

			if (SASToken.isTokenParam(key)) {
				token += key + '=' + val + '&'

				if (SASToken.isRequiredParam(key)) {
					required.push(key)
				}
			}
		})

		token = token.slice(0, -1) // remove trailing `&`
		return (token === '' && _hasAllRequired(required))
			? null
			: token
	}

	static isToken (str) {
		const params = new URLSearchParams(str)
		const required = []

		for (const key of params.keys()) {
			if (!SASToken.isTokenParam(key)) {
				return false
			}

			if (SASToken.isRequiredParam(key)) {
				required.push(key)
			}
		}

		return (queryParams.required.length === required.length)
	}

	static isEqual (token1, token2) {
		let t1 = token1.split('&').sort()
		let t2 = token2.split('&').sort()
		return JSON.stringify(t1) === JSON.stringify(t2)
	}

	static isTokenParam (p) {
		return utils.hasProperty(queryParams.all, p)
	}

	static isRequiredParam (p) {
		return queryParams.required.includes(p)
	}
}

function _hasAllRequired (toCheck) {
	const sorted = [...toCheck].sort()
	const truth = [...queryParams.required].sort()
	return sorted.toString() === truth.toString()
}


module.exports = SASToken