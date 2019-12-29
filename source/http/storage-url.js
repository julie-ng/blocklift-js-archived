const sasParams = require('./auth/sas-params')

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

	static getSasToken (fromUrl) {
		const url = new URL(fromUrl)
		// console.log(url.searchParams)

		// Custom Regex to manually extract signature search param
		// `URLSearchParams.toString()` de/encodes strings, which Azure API considers malformed.
		const sig = /(?<=sig=)([A-Za-z0-9%]+)/


		let token = ''
		for (const i in sasParams) {
			const key = sasParams[i]
			if (url.searchParams.get(key) === null) { return null }

			token += (key === 'sig')
				? 'sig=' + url.search.match(sig)[0] + '&' // signature as raw string
				: `${key}=` + url.searchParams.get(key) + '&'
		}

		if (token.endsWith('&')) {
			token = token.slice(0, -1)
		}

		return token
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