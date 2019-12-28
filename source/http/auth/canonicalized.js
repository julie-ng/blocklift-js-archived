// const defaultMsVersion = '2019-02-02' // latest
const utils = require('../../utils')

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

	/**
	 * Generates canonicalized resource string
	 * requied for created signature for `Authorization` header
	 *
	 * @function resource
	 * @param {String} urlString
	 * @return {String} formatted canonicalized resource
	 */
	resource: function (urlString = '') {
		let result = ''
		const url = new URL(urlString)

		// start with account name
		const accountName = _extractAccountName(url.host)
		result += `/${accountName}${url.pathname}\n`

		// consolidate multiple properties
		const mergedParams = _formatParams(url.searchParams)
		for (const prop in mergedParams) {
			result += prop + ':' + mergedParams[prop] + '\n'
		}

		return result.trimRight()
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

function _extractAccountName (host) {
	// return host.split('//')[1]
	// 	.replace(/.blob.core.windows.net.*/, '')
	return host
		.replace(/.blob.core.windows.net.*/, '')
		.replace('-secondary', '')
}

/**
 *
 * @param {URLSearchParams} searchParams
 */
function _formatParams (searchParams) {
	// sort params
	const sorted =  (Array.from(searchParams)).sort()

	// now combine multiple properties
	const merged = {}
	sorted.forEach((p) => {
		if (utils.hasProperty(merged, p[0])) {
			merged[p[0]] += ',' + p[1]
		} else {
			merged[p[0]] = p[1]
		}
	})

	return merged
}

module.exports = canonicalized