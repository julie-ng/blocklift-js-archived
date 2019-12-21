require('dotenv').config()
const Blockport = require('../source/blockport')

const serviceUrl = process.env.BLOB_SERVICE_SAS_URL
/**
 * Integration Tests against live Azure API
 * Note: this test suite must be run in order
 */
describe ('Integration Tests: Containers', () => {
	let bp
	let runId

	beforeAll(() => {
		bp = new Blockport({
			serviceUrl: serviceUrl
		})

		runId = 'integration-' + new Date().getMilliseconds()
	})

	it ('creates containers', (done) => {
		return bp.createContainer(runId)
			.then((data) => {
				expect(data.containerName).toEqual(runId)
				expect(data.statusText).toEqual('Created')
				done()
			})
			.catch((err) => {
				// TODO
			})
	})

	it ('lists containers', (done) => {
		return bp.listContainers()
			.then((data) => {
				expect(Array.isArray(data)).toBe(true)
				expect(data.find((c) => c.Name === runId)).not.toBe(undefined)
				done()
			})
			.catch((err) => {
				// TODO
			})
	})

	it ('deletes containers', (done) => {
		return bp.deleteContainer(runId)
			.then((data) => {
				expect(data.containerName).toEqual(runId)
				expect(data.statusText).toEqual('Accepted')
				done()
			})
			.catch((err) => {
				// TODO
			})
	})
})
