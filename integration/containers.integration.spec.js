require('dotenv').config()
const Blocklift = require('../source/blocklift')

const serviceUrl = process.env.BLOB_SERVICE_SAS_URL
/**
 * Integration Tests against live Azure API
 * Note: this test suite must be run in order
 */
describe ('Integration Tests: Containers', () => {
	let lift
	let runId

	beforeAll(() => {
		lift = new Blocklift({
			serviceUrl: serviceUrl
		})

		runId = 'integration-' + new Date().getMilliseconds()
	})

	it ('creates containers', (done) => {
		return lift.createContainer(runId)
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
		return lift.listContainers()
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
		return lift.deleteContainer(runId)
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
