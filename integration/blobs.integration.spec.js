require('dotenv').config()
const path = require('path')
const Blocklift = require('../source/blocklift')

const serviceUrl = process.env.BLOB_SERVICE_SAS_URL

/**
 * Integration Tests against live Azure API
 */
describe ('Integration Tests: Containers', () => {
	let lift
	let runId

	beforeAll(() => {
		lift = new Blocklift({
			serviceUrl: serviceUrl,
			defaultContainer: 'blocklift-test'
		})

		runId = 'integration-' + new Date().getMilliseconds()
	})

	it ('can upload textfiles', async () => {
		expect.assertions(2)
		const file = path.join(__dirname, '../mocks/files/hello.txt')
		const uploadOpts = {
			target: 'integration/hello-' + runId + '.txt'
		}
		const data = await lift.uploadFile(file, uploadOpts)

		expect(data.blob.container).toEqual('blocklift-test')
		expect(data.response.statusText).toEqual('Created')

		// TODO: make axios call to image and check contentType?
	})

	it ('can upload images', async () => {
		expect.assertions(2)
		const file = path.join(__dirname, '../mocks/files/image.png')
		const opts = {
			target: 'integration/image-' + runId + '.png'
		}
		const data = await lift.uploadFile(file, opts)
		expect(typeof data.blob.etag).toEqual('string')
		expect(data.blob.etag).not.toEqual('')

		// TODO: make axios call to image and check contentType?
	})
})


