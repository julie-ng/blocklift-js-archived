/* eslint-disable no-prototype-builtins */
const axios = require('axios')
const HttpClient = require('./client')

// Mock Service URL with SAS (expired)
const testHost = 'https://notarealaccount.blob.core.windows.net/'
const testSasToken = "sv=2019-02-02&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-12-19T21:33:32Z&st=2019-12-19T13:33:32Z&spr=https&sig=jb9hodlbu9kMBA9KptT%2FArgRYcY3%2BCEs4fERQIWB8Y0%3D"
const clientOpts = {
	serviceUrl: testHost + '?' + testSasToken
}

jest.mock('axios')

describe ('HttpClient', () => {
	describe ('Constructor', () => {
		// const requestIntercptor = jest.fn()
		// const responseIntercptor = jest.fn()

		beforeEach(() => {
			axios.create.mockImplementation(() => {
				return {
					interceptors: {
						request: {
							use: jest.fn()
						},
						response: {
							use: jest.fn()
						}
					}
				}
			})
		})

		// afterEach(() => {
		// 	requestIntercptor.mockRestore()
		// 	responseIntercptor.mockRestore()
		// })

		describe ('axios', () => {
			it ('creates a new axios instance at `axios` property', () => {
				const spy = jest.spyOn(axios, 'create')
				const c = new HttpClient(clientOpts)
				expect(c.hasOwnProperty('axios')).toBe(true)
				expect(spy).toHaveBeenCalledTimes(1)
				spy.mockRestore()
			})

			// pending ('sets request interceptors', () => {
			// 	expect(requestIntercptor).toHaveBeenCalledTimes(1)
			// })
		})

		describe ('sets instance properties', () => {
			let client

			beforeEach(() => {
				client = new HttpClient(clientOpts)
			})

			it ('sets a `sasToken` property ', () => {
				expect(client.sasToken).toEqual(testSasToken)
			})
		})
	})
})