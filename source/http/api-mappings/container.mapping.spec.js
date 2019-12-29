const mappings = require('./container.mapping')
const helpers = require('./mapping-spec.helpers')

describe ('Container REST API Mappings', () => {
	const requiredKeys = ['list', 'create', 'delete']

	it ('mappings are defined correctly', () => {
		requiredKeys.forEach((k) => {
			expect(typeof mappings[k]).toEqual('function')
			helpers.confirmRequiredProps(mappings[k])
		})
	})
})