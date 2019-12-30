const utils = require('./index')

describe ('Utils', () => {
	describe ('hasProperty()', () => {
		const obj = {
			foo: 'bar'
		}

		it ('returns `true` if object has property', () => {
			expect(utils.hasProperty(obj, 'foo')).toBe(true)
		})

		it ('returns `faslse` if object does not has property', () => {
			expect(utils.hasProperty(obj, 'notexist')).toBe(false)
		})
	})
})