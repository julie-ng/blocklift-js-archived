const xmlParser = require('fast-xml-parser')

/**
 * Formats axios errors before passing to blocklift client
 *
 * @param {Object} err - axios error object
 * @param {function} reject
 */
function catchError (err, reject) {
	let response =  (err.response)
		? _formatError(err)
		: err

	reject(response)
}

/**
 * Formats error, transforming XML if necessary
 *
 * @private
 * @param {Object} err - Axios Error Object
 */
function _formatError (err) {
	let data = (xmlParser.validate(err.response.data) === true)
		? xmlParser.parse(err.response.data)
		: err.response.data

	return {
		status: err.response.status,
		headers: err.response.headers,
		data: data
	}
}

module.exports = catchError