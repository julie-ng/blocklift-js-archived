const fs = require('fs')
const path = require('path')
const xmlParser = require('fast-xml-parser')

const xml = fs
	.readFileSync(path.join(__dirname, 'containers-list.xml'))
	.toString()
	.replace(/[\t\n\r]/gm,'')

module.exports = {
	list: {
		object: require('./containers-list'),

		// axios resolves body as a string
		xmlString: xml,

		// mock axios transformed request
		xmlObject: xmlParser.parse(xml)
	}
}