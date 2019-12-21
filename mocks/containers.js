const fs = require('fs')
const path = require('path')

module.exports = {
	list: {
		xml: fs.readFileSync(path.join(__dirname, 'containers-list.xml')).toString(),
		obj: require('./containers-list')
	}
}