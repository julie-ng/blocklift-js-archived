const xmlParser = require('fast-xml-parser')

/**
 * Formats axios errors before passing to blockport client
 *
 * @param {Object} err - axios error object
 * @param {function} reject
 */
function catchError (err, reject) {
	let response =  (err.response)
		? formatError(err)
		: err

	reject(response)
}

/**
 * Formats error, transforming XML if necessary
 *
 * @private
 * @param {Object} - Axios Error Object
 */
function formatError (err) {
	let data = (xmlParser.validate(data) === true)
		? xmlParser.parse(err.response.data)
		: err.response.data

	return {
		status: err.response.status,
		headers: err.response.headers,
		data: data
	}
}

module.exports = catchError