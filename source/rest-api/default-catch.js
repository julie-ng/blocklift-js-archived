const xmlParser = require('fast-xml-parser')

/**
 * Formats axios errors before passing to blocklift client
 *
 * @param {Object} err - axios error object
 * @param {function} reject
 */
function catchError (err, reject) {
	const request = {
		method: err.request.method,
		path: err.request.path,
		headers: err.request._headerSent
	}

	let response =  (err.response)
		? _formatError(err)
		: err

	reject({ ...response, _request: request })
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
		statusText: err.response.statusText,
		// headers: err.response.headers,
		data: data
	}
}

module.exports = catchError