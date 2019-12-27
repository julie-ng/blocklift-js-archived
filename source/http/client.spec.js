// const axios = require('axios')
const HttpClient = require('./client')

// jest.mock('axios')

describe ('HttpClient', () => {
	let client
	const host = 'https://blobstorage/'

	beforeEach(() => {
		client = new HttpClient(host)
	})

	describe ('Constructor', () => {
		xit ('sets `client` as an instance attribute', () => {
			// console.log('client?', client)

			expect(client.client).not.toEqual('fsdf')
		})
	})
})