const xmlParser = require('fast-xml-parser')

/**
 * Response Data from XML to JS Object
 *
 * @param {String} data
 * @returns {Object} data
 */
function transformXML (data) {
	// console.log('transformXML()', data)
	return (data && xmlParser.validate(data) === true)
		? xmlParser.parse(data)
		: data
}

module.exports = transformXML