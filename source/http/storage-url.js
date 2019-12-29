const sasParams = require('./auth/sas-params')
const SASToken = require('./auth/sas-token')

class StorageURL {

	/**
	 * Constructor
	 *
	 * @param {String} url - url string
	 */
	constructor (url) {
		this.url = url
	}

	/**
	 * Appends params to URL, in the form of a string `id=123` or  an object `{ id: 123 }`,
	 * adding `?` and `&` operators as needed.
	 *
	 * @param {String|Object} param - query parameter
	 */
	append (param) {
		let base = this.url
		base += _nextSeparator(base)

		if (typeof param === 'string') {
			base += param
		}

		if (_isPlainObject(param)) {
			base += (new URLSearchParams(param)).toString()
		}

		this.url = base

		return this
	}

	static getAccountName (url) {
		// const regex = /(?<=http(s*):\/\/)(.*)(?=.blob.core.windows.net)/
		const u = new URL(url)
		return u.hostname
			.replace('.blob.core.windows.net', '')
			.replace('-secondary', '')
	}

	static getContainerName (url) {
		// const regex = /(blob.core.windows.net\/)(\w+)/
		const u = new URL(url)
		return (u.pathname === '/')
			? null
			: u.pathname.split('/')[1]
	}

	static getBlobpath (url) {
		// const regex = /(blob.core.windows.net\/)(\w+)/
		const u = new URL(url)
		const dirs = u.pathname.split('/')
		return (dirs.length >= 3 && dirs[2] !== '')
			? dirs[2]
			: null
	}
}

function _nextSeparator (url) {
	let c
	if (url.indexOf('?') === -1) {
		c = '?'
	} else if (!url.endsWith('?') && !url.endsWith('&')) {
		c = '&'
	} else {
		c = ''
	}
	return c
}

function _isPlainObject (obj) {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

module.exports = StorageURL