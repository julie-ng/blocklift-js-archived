const mappings = require('./mappings')

describe ('Mappings (for REST api)', () => {
	describe ('Containers', () => {
		const map = mappings.container
		let keys = ['list', 'create', 'delete']

		it ('has containers mappings', () => {
			expect(mappings.container).not.toBe(undefined)

			keys.forEach((k) => {
				expect(typeof map[k]).toEqual('function')
			})
		})
	})

	describe ('Blobs', () => {
		const map = mappings.blob
		let keys = ['list', 'create', 'delete', 'createSnapshot', 'deleteSnapshot']

		it ('has blobs mappings', () => {
			expect(mappings.blob).not.toBe(undefined)

			keys.forEach((k) => {
				expect(typeof map[k]).toEqual('function')
			})
		})
	})
})