/**
 * Filter out noise from axios responses.
 *
 * @param {Object} response - axios response object
 */
function filterResponse (response) {
	return {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
		data: response.data
	}
}

module.exports = filterResponse