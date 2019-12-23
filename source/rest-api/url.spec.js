const URL = require('./url')

describe.only ('URL', () => {
	describe ('Constructor', () => {
		it ('sets `url` property', () => {
			let a = new URL('')
			expect(a.url).toEqual('')

			let b = new URL('helloW0rld%')
			expect(b.url).toEqual('helloW0rld%')
		})
	})

	describe ('append()', () => {
		let u

		beforeEach (() => {
			u = new URL('base')
		})

		it ('does not introduce extra `?`', () => {
			let a = new URL('base?')
			a.append('id=1')
			expect(a.url).toEqual('base?id=1')
		})

		it ('can append strings', () => {
			u.append('a=b')
			expect(u.url).toEqual('base?a=b')
		})

		it ('can append objects', () => {
			u.append({
				c: 'd'
			})
			expect(u.url).toEqual('base?c=d')
		})

		it ('can append multiple times', () => {
			u.append('a=b')
			u.append('c=d')
			expect(u.url).toEqual('base?a=b&c=d')
		})

		it ('can base chained', () => {
			u.append('a=b')
			 .append('c=d')
			expect(u.url).toEqual('base?a=b&c=d')
		})

		it ('can add token', () => {
			let a = new URL('?comp=list')
			a.append('a=b&c=d')
			expect(a.url).toEqual('?comp=list&a=b&c=d')
		})
	})
})