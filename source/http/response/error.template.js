const xmlParser = require('fast-xml-parser')
const filterResponse = require('./filter-axios.template')

/**
 * @param {Object} err - axios error object
 */
function template (err) {
	let response =  (err.response)
		? _formatError(err)
		: err

	return {
		...response,
		_request: {
			method: err.request.method,
			path: err.request.path,
			headers: err.request._headerSent
		}
	}
}

/**
 * Formats error, transforming XML if necessary
 *
 * @private
 * @param {Object} err - Axios Error Object
 */
function _formatError (err) {
	let res = filterResponse(err.response)
	const parsedData = (xmlParser.validate(res.data) === true)
		? xmlParser.parse(res.data)
		: res.data

	return {
		...res,
		data: parsedData
	}
}

module.exports = template