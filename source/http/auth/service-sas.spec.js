/* eslint-disable no-prototype-builtins */

const ServiceSAS = require('./service-sas')
const queryParams = require('./sas-params')

const testToken = 'sv=2019-02-02&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-12-28T16:35:06Z&st=2019-12-28T08:35:06Z&spr=https&sig=WoKgH%2FjAcZNySamAMqw%2Bnd0h%2BVSGwXJbXsAlBRMfZIU%3D'

describe ('ServiceSAS', () => {
	describe ('Constructor', () => {
		it ('sets a `token` property', () => {
			let sas = new ServiceSAS(testToken)
			expect(sas.token).toEqual(testToken)
		})

		it ('saves each SAS param', () => {
			let sas = new ServiceSAS(testToken)
			queryParams.forEach((param) => {
				expect(sas.hasOwnProperty(param)).toBe(true)
			})
		})

		it ('only stores SAS params', () => {
			let token = new ServiceSAS(testToken + '&foo=bar')
			expect(token.hasOwnProperty('foo')).toBe(false)
		})
	})
})