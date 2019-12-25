const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

/**
 * Object Blob
 * does not care which container it is in
 *
 * @property {String} source - source filename/path
 * @property {String} location - destination path
 * @property {String} md5 - base64 encoded md5 hash of content used for validating file integrity after transport
 */
class Blob {
	/**
	 *
	 * @param {String} source - filename/path
	 * @param {Object} opts
	 * @param {String} opts.location - blob destination path on server
	 */
	constructor (source, opts = {}) {
		// console.log('source', source)
		this.source = source
		this.location = opts.location || ''
		this.headers = {
			'x-ms-blob-type': 'BlockBlob',
			'x-ms-access-tier': 'Hot'
		}

		this.readSync()
	}

	/**
	 * Reads a file synchronously, setting `data` and `md5` properties
	 */
	readSync () {
		let body = fs.readFileSync(this.source).toString()
		this.md5 = contentMd5(body)
		this.body = body
	}

	getProperties() {
		return {
			source: this.source,
			location: this.location,
			md5: this.md5
		}
	}
}

function contentMd5 (data) {
	return crypto.createHash('md5').update(data).digest('base64')
}

module.exports = Blob
