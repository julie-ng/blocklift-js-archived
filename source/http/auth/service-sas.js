const queryParams = require('./sas-params')

/**
 * Service Access Signature
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
class ServiceSAS {

	/**
	 * @param {String} sasToken extracted from URL
	 */
	constructor (sasToken) {
		this.token = sasToken
		sasToken
			.split('&')
			.forEach((prop) => {
				const keyval = prop.split('=')
				if (queryParams.includes(keyval[0])) {
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
}

module.exports = ServiceSAS