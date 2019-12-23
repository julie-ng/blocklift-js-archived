const fs = require('fs')
const path = require('path')

function readXML (file) {
	return fs
		.readFileSync(path.join(__dirname, file))
		.toString()
		.replace(/[\t\n\r]/gm,'')
}

module.exports = {
	readXML: readXML
}