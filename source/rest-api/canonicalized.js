const defaultMsVersion = '2019-02-02' // latest

/**
 * Canonical Helpers, uses for generating `Authorization` headers when using Access Keys.
 *
 * @module canonicalized
 */
const canonicalized = {

	/**
	 * Generates Canonical Headers by extracting `x-ms-` headers
	 * and formatting like so
	 *
	 * - keys: transforms to lower case
	 * - keys: trims whitespace
	 * - values: removes double whitespace not inside quotes
	 *
	 * and finally merging all into a string, for example:
	 * ```
	 * 'x-ms-date:Sat, 21 Feb 2015 00:48:38 GMT\nx-ms-version:2014-02-14\n'
	 * ```
	 *
	 * @function header
	 * @param {Object} headers
	 * @returns {String} formatted canonicalized header
	 */
	header: function (headers = {}) {
		const msHeaders = _extractMSHeaders(headers)
		let str = ''
		for (const k in msHeaders) {
			str += `${k}:${msHeaders[k]}\n`
		}
		return str
	},

	resource: function () {

	},
}

// --- Helpers ---

function _extractMSHeaders (headers) {
	let msHeaders = {}
	for (const k in headers) {
		const key = k.trim().toLowerCase()
		if (key.startsWith('x-ms-')) {
			const cleaned = _removeWhitespacesNotInsideQuotes(headers[k].trim())
			msHeaders[key] = cleaned
		}
	}
	return msHeaders
}

function _removeWhitespacesNotInsideQuotes (subj = '') {
	const regex = /((\s{2,})|\t|\n)(?=([^"]*"[^"]*")*[^"]*$)/g
	return subj.replace(regex, ' ')
}

module.exports = canonicalized