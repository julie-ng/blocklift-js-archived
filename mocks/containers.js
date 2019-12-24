const xmlParser = require('fast-xml-parser')
const helper = require('./helper')
const XMLList = helper.readXML('./xml/containers-list.xml')
const XMLSingle = helper.readXML('./xml/containers-single.xml')

/**
 * Mock Containers Response
 *
 * Each property has following sub-properties
 * - `list`: response with multiple containers
 * - `single`: response with just 1 container. This is by default not wrapped in an array.
 *
 * @property {Object} xml - raw Azure responses as strings
 * @property {Object} obj - xml parsed into objects, still in Azure format with `EnumerationResults…` etc.
 * @property {Object} parsed - object response with Azure wrappers removed
 */
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