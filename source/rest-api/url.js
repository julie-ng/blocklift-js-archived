/**
 * Custom URL Builder
 *
 * @property {String} url
 */
class URL {

	/**
	 * Constructor
	 *
	 * @param {String} url - base URL, preferably without any query parameters
	 */
	constructor (url) {
		this.url = url
	}

	/**
	 * Appends params to URL, in the form of a string `id=123` or  an object `{ id: 123 }`,
	 * adding `?` and `&` operators as needed.
	 *
	 * @param {String|Object} toAdd
	 */
	append (toAdd) {
		let base = this.url

		if (!hasQ(base)) {
			base += '?'
		} else if (!endsWith(base, '?') && !endsWith(base, '&')) {
			base += '&'
		}

		if (typeof toAdd === 'string') {
			base += toAdd
		}

		if (isPlainObject(toAdd)) {
			base += (new URLSearchParams(toAdd)).toString()
		}

		this.url = base

		return this
	}
}

function hasQ (str) {
	return (str.indexOf('?') > -1)
}

function endsWith (str, char) {
	return (str[str.length - 1] === char)
}

function isPlainObject (obj) {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

module.exports = URL