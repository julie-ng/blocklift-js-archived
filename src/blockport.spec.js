const axios = require('axios')
const Blockport = require('./blockport')

// Mock Service URL with SAS (expired)
const testServiceUrl = "https://notarealaccount.blob.core.windows.net/?sv=2019-02-02&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-12-19T21:33:32Z&st=2019-12-19T13:33:32Z&spr=https&sig=jb9hodlbu9kMBA9KptT%2FArgRYcY3%2BCEs4fERQIWB8Y0%3D"

const containersMocks = require('../mocks/containers')

jest.mock('axios')
describe ('Blockport', () => {
	let bp

	beforeEach(() => {
		bp = new Blockport({
			serviceUrl: testServiceUrl
		})
	})
	describe ('Constructor', () => {

		it ('sets `serviceUrl` property', () => {
			expect(bp.serviceUrl).toEqual(testServiceUrl)
		})

		it ('sets `host` property', () => {
			expect(bp.host).toEqual('https://notarealaccount.blob.core.windows.net/')
		})

		it ('sets `sas` property', () => {
			expect(bp.sas).toEqual('sv=2019-02-02&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-12-19T21:33:32Z&st=2019-12-19T13:33:32Z&spr=https&sig=jb9hodlbu9kMBA9KptT%2FArgRYcY3%2BCEs4fERQIWB8Y0%3D')
		})
	})

	describe ('Containers', () => {
		xdescribe ('listContainers()', () => {
			it ('can list containers', () => {
				axios.get.mockResolvedValue({
					data: containersMocks.list.xml
				})

				return bp.listContainers().then((data)=> {
					expect(data).toEqual(containersMocks.list.obj)
				})
			})
		})

		describe ('createContainer()', () => {
			pending ('can create a container')
			pending ('can delete a container')
		})

		describe ('deleteContainer()', () => {
			pending ('can delete a container')
		})
	})
})