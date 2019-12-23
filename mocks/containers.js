const xmlParser = require('fast-xml-parser')
const helper = require('./helper')
const XMLList = helper.readXML('./xml/containers-list.xml')
const XMLSingle = helper.readXML('./xml/containers-single.xml')

const containers = {
	xml: {
		list: XMLList,
		single: XMLSingle
	},

	obj: {
		list: xmlParser.parse(XMLList),
		single: xmlParser.parse(XMLSingle)
	}
}

module.exports = {
	...containers,
	parsed: {
		list: containers.obj.list.EnumerationResults.Containers.Container,
		single: containers.obj.single.EnumerationResults.Containers.Container
	}
}