const SharedKey = require('./shared-key')

describe ('SharedKey', () => {
	describe ('Constructor', () => {
		it ('has a constructor', () => {
			expect(() => {
				new SharedKey('accountname')
			}).not.toThrow()
		})
	})
})