/* eslint-disable no-prototype-builtins */
module.exports = {
	confirmRequiredProps: function (ref) {
		let result = ref.call()
		expect(result.hasOwnProperty('method')).toBe(true)
		expect(result.hasOwnProperty('pathname')).toBe(true)
		return
	}
}
