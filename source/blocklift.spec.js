const Blocklift = require('./blocklift')
const HttpClient = require('./http/client')

const mockRequest = jest.fn()
jest.mock('./http/client', () => {
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
		it ('defaults `defaultContainer` property to false', () => {
			expect(lift.defaultContainer).toBe(false)
		})

		it ('can set `defaultContainer` property', () => {
			let b = new Blocklift({
				serviceUrl: testServiceUrl,
				defaultContainer: 'hello'
			})
			expect(b.defaultContainer).toEqual('hello')
		})

		it ('instantiates a `HttpClient`', () => {
			expect(HttpClient).toHaveBeenCalledTimes(1)
		})
	})

	describe ('Containers', () => {
		describe ('listContainers()', () => {
			it ('can list containers', (done) => {
				const mockResponse = { data: containersMocks.obj.list }
				lift.client.request.mockImplementationOnce(() => Promise.resolve(mockResponse))
				return lift.listContainers().then((data)=> {
					expect(data.containers).toEqual(containersMocks.parsed.list)
					done()
				})
			})

			it ('always returns array if only 1 result', (done) => {
				const mockResponse = { data: containersMocks.obj.single }
				lift.client.request.mockImplementationOnce(() => Promise.resolve(mockResponse))
				return lift.listContainers().then((data)=> {
					expect(data.containers).toEqual([containersMocks.parsed.single])
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