const Blocklift = require('./blocklift')
const HttpClient = require('./rest-api/client')

const mockRequest = jest.fn()
jest.mock('./rest-api/client', () => {
	return jest.fn().mockImplementation(() => {
		return { request: mockRequest }
	})
})

const containersMocks = require('../mocks/containers')

// Mock Service URL with SAS (expired)
const testServiceUrl = "https://notarealaccount.blob.core.windows.net/?sv=2019-02-02&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-12-19T21:33:32Z&st=2019-12-19T13:33:32Z&spr=https&sig=jb9hodlbu9kMBA9KptT%2FArgRYcY3%2BCEs4fERQIWB8Y0%3D"

describe ('Blocklift', () => {
	let lift

	beforeEach(() => {
		HttpClient.mockClear()

		lift = new Blocklift({
			serviceUrl: testServiceUrl
		})
	})

	describe ('Constructor', () => {

		it ('sets `serviceUrl` property', () => {
			expect(lift.serviceUrl).toEqual(testServiceUrl)
		})

		it ('sets `host` property', () => {
			expect(lift.host).toEqual('https://notarealaccount.blob.core.windows.net/')
		})

		it ('sets `sas` property', () => {
			expect(lift.sas).toEqual('sv=2019-02-02&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-12-19T21:33:32Z&st=2019-12-19T13:33:32Z&spr=https&sig=jb9hodlbu9kMBA9KptT%2FArgRYcY3%2BCEs4fERQIWB8Y0%3D')
		})

		it ('instantiates a `HttpClient`', () => {
			expect(HttpClient).toHaveBeenCalledTimes(1)
		})
	})

	describe ('Containers', () => {
		describe ('listContainers()', () => {
			it ('can list containers', (done) => {
				const mockResponse = {
					data: containersMocks.list.xmlObject
				}

				lift.client.request.mockImplementationOnce(() => Promise.resolve(mockResponse))

				return lift.listContainers().then((data)=> {
					expect(data).toEqual(containersMocks.list.object)
					done()
				})
			})

			test.todo('catches errors')
		})

		describe ('createContainer()', () => {
			test.todo ('can create a container')
			test.todo ('can delete a container')
		})

		describe ('deleteContainer()', () => {
			test.todo ('can delete a container')
		})
	})

	// describe ('Blobs', () => {
	// 	describe ('listBlobs()', () => {

	// 	})
	// })
})