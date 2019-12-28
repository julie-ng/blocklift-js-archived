const fs = require('fs')
const crypto = require('crypto')
const fileType = require('file-type')
const isBinaryPath = require('is-binary-path')
const utils = require('./utils')
const textMimeTypes = {
	txt: 'text/plain',
	xml: 'text/xml',
	csv: 'text/csv'
}

/**
 * Object Blob class to normalize paths, with _and_ without container names,
 * and reading properties and metadata including `Content-Type` and  MD5 hashes.
 * By default, `Blob` can handle both text files and binary files, e.g. images.
 *
 * @property {String} account - storage account name
 * @property {String} container - container name
 * @property {String} path - path name, which will be normalized, removing leading `/`, and releative paths, e.g. `./`, `../`, etc.
 * @property {String} pathname - combined container and path name
 * @property {String} contentType - full path with container and filename
 * @property {String} md5 - base64 encoded md5 hash of content used for validating file integrity after transport
 * @property {Object} file - full path with container and filename
 * @property {String} file.name - full path with container and filename
 * @property {String} file.ext - full path with container and filename
 * @property {Buffer|String} file.body - full path with container and filename
 */
class BlockBlob {
	/**
	 *
	 * @param {String} source - filename/path
	 * @param {Object} opts
	 * @param {String} opts.container - storage container is required
	 */
	constructor (source, opts = {}) {
		// console.log(`new Blob(${source})`, opts)

		if (!utils.hasProperty(opts, 'container')) {
			throw 'BlockBlob: missing required `container` property'
		}

		this.headers = {
			'x-ms-blob-type': 'BlockBlob',
			'x-ms-access-tier': 'Hot'
		}

		this.container = opts.container

		this.path = utils.hasProperty(opts, 'target')
			? opts.target
			: _removeRelativePath(source)

		this.pathname = this.container + '/' + this.path

		this.file = {
			name: _getFilename(source),
			ext: _fileExtension(source)
		}
		this.readSync(source)
	}

	/**
	 * Reads a file synchronously, setting `data` and `md5` properties.
	 * Do you call. Referenced in Constructor.
	 *
	 * @private
	 * @param {String} source - file name
	 */
	readSync (source) {
		const data = fs.readFileSync(source)
		const isBinary = isBinaryPath(source)

		this.file.body = isBinary
			? data
			: data.toString()
		this.md5 = _contentMd5(this.file.body)

		this.contentType = isBinary
			? fileType(data).mime
			: textMimeTypes[this.file.ext]

		this.headers['Content-MD5'] = this.md5
		this.headers['Content-Type'] = this.contentType
	}

	/**
	 * Returns following `Blob` properties, i.e. without `file` and HTTP `headers`:
	 *
	 * - `container`
	 * - `path`
	 * - `pathname`
	 * - `contentType`
	 * - `md5`
	 *
	 * @return {Object}
	 */
	getProperties () {
		return {
			container: this.container,
			path: this.path,
			pathname: this.pathname,
			// href: `https://{this.account}.blob.core.windows.net/`,
			contentType: this.contentType,
			md5: this.md5
		}
	}
}

function _contentMd5 (data) {
	return crypto.createHash('md5').update(data).digest('base64')
}

function _getFilename (filepath) {
	let parts = filepath.split('/')
	return parts[ parts.length - 1 ]
}

function _fileExtension (filename) {
	let parts = filename.split('.')
	return parts[ parts.length - 1 ]
}

function _removeRelativePath (filepath) {
	let parts = filepath.split('/')
	while (parts[0].startsWith('.')) {
		parts.shift()
	}
	let newpath = parts.join('/')

	return (newpath.startsWith('/'))
		? newpath.substring(1)
		: newpath
}

module.exports = BlockBlob
