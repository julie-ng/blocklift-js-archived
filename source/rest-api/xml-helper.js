const xmlParser = require('fast-xml-parser')

/**
 * Response Data from XML to JS Object
 *
 * @private
 * @param {String} data - XML string without any leading or trailing whitespace on each line.
 * @returns {Object} data - XML parsed into object. Note object keys remain in original case, e.g. `Container`.
 */
function transformXML (data) {
	// console.log('transformXML()', data)
	return (data && xmlParser.validate(data) === true)
		? xmlParser.parse(data)
		: data
}

module.exports = transformXML