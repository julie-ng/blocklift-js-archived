const fs = require('fs')
const path = require('path')

/**
 * Reads XML file and returns string and removes
 * leading and trailing whitespaces and tabs for fast-xml-parser
 *
 * @param {String} file - relative path
 */
function readXML (file) {
	return fs
		.readFileSync(path.join(__dirname, file))
		.toString()
		.replace(/[\t\n\r]/gm,'')
}

module.exports = {
	readXML: readXML
}