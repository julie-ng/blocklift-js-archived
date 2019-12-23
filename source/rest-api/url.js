class URL {
	constructor (str) {
		this.url = str
	}

	append (toAdd) {
		let base = this.url

		if (!hasQ(base)) {
			// console.log('what base', base)
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