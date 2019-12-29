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
		expect.assertions(2)
		return lift.createContainer(runId)
			.then((res) => {
				// console.log('res', res)
				expect(res.containerName).toEqual(runId)
				expect(res.statusText).toEqual('Created')
				done()
			})
			.catch((err) => {
				// TODO
			})
	})

	it ('lists containers', (done) => {
		expect.assertions(2)
		return lift.listContainers()
			.then((res) => {
				expect(Array.isArray(res.containers)).toBe(true)
				expect(res.containers.find((c) => c.Name === runId)).not.toBe(undefined)
				done()
			})
			.catch((err) => {
				// TODO
			})
	})

	it ('deletes containers', (done) => {
		expect.assertions(2)
		return lift.deleteContainer(runId)
			.then((res) => {
				// console.log('res', res)
				expect(res.containerName).toEqual(runId)
				expect(res.statusText).toEqual('Accepted')
				done()
			})
			.catch((err) => {
				// TODO
			})
	})
})
