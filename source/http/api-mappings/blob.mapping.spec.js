const mappings = require('./blob.mapping')
const helpers = require('./mapping-spec.helpers')

describe ('Blob REST API Mappings', () => {
	const requiredKeys = ['list', 'create', 'delete', 'createSnapshot', 'deleteSnapshot']

	it ('mappings are defined correctly', () => {
		requiredKeys.forEach((k) => {
			expect(typeof mappings[k]).toEqual('function')
			helpers.confirmRequiredProps(mappings[k])
		})
	})
})
