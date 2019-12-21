function catchError (err, reject) {
	let response =  (err.response)
		? formatError(err)
		: err

	reject(response)
}

/**
 * @private
 * @param {Object} - Axios Error Object
 */
function formatError (err) {
	return {
		status: err.response.status,
		headers: err.response.headers,
		data: err.response.data // xmlParser.parse(err.response.data)
	}
}

module.exports = catchError