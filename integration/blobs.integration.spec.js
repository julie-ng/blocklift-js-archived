require('dotenv').config()
const path = require('path')
const Blocklift = require('../source/blocklift')

const serviceUrl = process.env.BLOB_SERVICE_SAS_URL

// Actual files on server
const actualTestBlobs = [
	'folder',
	'folder/file.txt',
	'hello.txt',
	'image.png'
]

/**
 * Integration Tests against live Azure API
 */
describe ('Integration Tests: Containers', () => {
	let lift
	let runId

	beforeAll(() => {
		lift = new Blocklift({
			serviceUrl: serviceUrl,
			defaultContainer: 'tests'
		})

		runId = 'integration-' + new Date().getMilliseconds()
	})

	it ('can list blobs', async () => {
		expect.assertions(2)
		const res = await lift.listBlobs()
		// console.log(res)
		let blobNames = []
		res.blobs.forEach((b) => {
			blobNames.push(b.Name)
		})
		// expect(res).toEqual(1)
		expect(blobNames).toEqual(actualTestBlobs)
		expect(res.response.status).toEqual(200)
	})

	describe ('Uploads', () => {
		const testContainer = 'no-delete-yet'
		const blockliftBlobProperties = [
			'container',
			'path',
			'url',
			'contentType',
			'md5',
			'etag'
		]

		it ('can upload textfiles', async () => {
			expect.assertions(5)
			const file = path.join(__dirname, '../mocks/files/hello.txt')
			const uploadOpts = {
				container: testContainer,
				target: 'upload/hello-' + runId + '.txt'
			}
			const data = await lift.uploadFile(file, uploadOpts)
			// console.log('data', data)

			expect(data.blob.container).toEqual(testContainer)
			expect(data.response.statusText).toEqual('Created')
			expect(Object.keys(data.blob)).toEqual(blockliftBlobProperties)
			expect(data.blob.contentType).not.toEqual('')
			expect(data.blob.etag).not.toEqual('')
			// TODO: make axios call to image and check contentType?
		})

		it ('can upload images', async () => {
			expect.assertions(5)
			const file = path.join(__dirname, '../mocks/files/image.png')
			const opts = {
				container: testContainer,
				target: 'integration/image-' + runId + '.png'
			}

			const data = await lift.uploadFile(file, opts)
			expect(data.blob.container).toEqual(testContainer)
			expect(data.response.statusText).toEqual('Created')
			expect(Object.keys(data.blob)).toEqual(blockliftBlobProperties)
			expect(data.blob.contentType).not.toEqual('')
			expect(data.blob.etag).not.toEqual('')
			// TODO: make axios call to image and check contentType?
		})
	})
})


