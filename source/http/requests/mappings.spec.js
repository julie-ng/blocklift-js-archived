/* eslint-disable no-prototype-builtins */
const mappings = require('./mappings')

describe ('Mappings (for REST api)', () => {
	describe ('Containers', () => {
		const map = mappings.container
		const keys = ['list', 'create', 'delete']

		it ('has containers mappings', () => {
			expect(mappings.hasOwnProperty('container')).toBe(true)
		})

		it ('mappings are defined correctly', () => {
			keys.forEach((k) => {
				expect(typeof map[k]).toEqual('function')
				confirmRequiredProps(map[k])
			})
		})
	})

	describe ('Blobs', () => {
		const map = mappings.blob
		const keys = ['list', 'create', 'delete', 'createSnapshot', 'deleteSnapshot']

		it ('has blobs mappings', () => {
			expect(mappings.hasOwnProperty('blob')).toBe(true)
		})

		it ('mappings are defined correctly', () => {
			keys.forEach((k) => {
				expect(typeof map[k]).toEqual('function')
				confirmRequiredProps(map[k])
			})
		})
	})
})

// --- helper ---

function confirmRequiredProps (ref) {
	let result = ref.call()
	expect(result.hasOwnProperty('method')).toBe(true)
	expect(result.hasOwnProperty('path')).toBe(true)
	return
}
