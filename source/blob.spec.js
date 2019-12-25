const fs = require('fs')
const Blob = require('./blob')
const isBinaryPath = require('is-binary-path')

jest.mock('fs')
jest.mock('is-binary-path')

describe ('Blob', () => {
	let blob
	const opts = { container: 'container' }

	describe ('Constructor()', () => {
		beforeEach(() => {
			fs.readFileSync.mockReturnValue('My content')
			isBinaryPath.mockReturnValue(false)
			blob = new Blob('hello.txt', opts)
		})

		it ('throws if missing `container` param', () => {
			expect(() => {
				new Blob('file.txt')
			}).toThrow('Blob: missing required `container` property')
		})

		it ('sets default http Headers', () => {
			expect(blob.headers['x-ms-blob-type']).toEqual('BlockBlob')
			expect(blob.headers['x-ms-access-tier']).toEqual('Hot')
		})

		it ('sets `Content` http Headers', () => {
			expect(blob.headers['Content-Type']).toEqual('text/plain')
			expect(blob.headers['Content-MD5']).toEqual('PXY7+q6AbRLNHH3mNQ99CA==')
		})

		it ('calls readSync() to set content based properties', () => {
			const spy = jest.spyOn(Blob.prototype, 'readSync')
			new Blob('foo.txt', opts)
			expect(spy).toHaveBeenCalledTimes(1)
			spy.mockRestore()
		})
	})

	describe('Properties', () => {
		beforeEach(() => {
			fs.readFileSync.mockReturnValue('My content')
			isBinaryPath.mockReturnValue(false)
			blob = new Blob('./../mocks/files/hello.txt', {
				container: 'mycontainer'
			})
		})

		describe ('Text files (default)', () => {
			it ('has a `container` property', () => {
				expect(blob.container).toEqual('mycontainer')
			})

			it ('has a `contentType` property', () => {
				expect(blob.contentType).toEqual('text/plain')
			})

			describe ('`file` properties', () => {
				it ('has a `name` property', () => {
					expect(blob.file.name).toEqual('hello.txt')
				})

				it ('has a `ext` file extension', () => {
					expect(blob.file.ext).toEqual('txt')
				})

				it ('has a String `file.body`', () => {
					expect(typeof blob.file.body).toEqual('string')
				})
			})

			describe ('`path` property', () => {
				const source = 'a/b.txt'

				it ('based on source param', () => {
					let b = new Blob(source, opts)
					expect(b.path).toEqual('a/b.txt')
				})

				it ('also removes relative paths', () => {
					let b = new Blob('./' + source, opts)
					let c = new Blob('./../' + source, opts)
					let d = new Blob('../' + source, opts)
					expect(b.path).toEqual('a/b.txt')
					expect(c.path).toEqual('a/b.txt')
					expect(d.path).toEqual('a/b.txt')
				})

				it ('also removes absolute path', () => {
					let b = new Blob('/' + source, opts)
					expect(b.path).toEqual('a/b.txt')
				})
			})

			it ('has a `fullPath` property, with name and container', () => {
				expect(blob.fullPath).toEqual('mycontainer/mocks/files/hello.txt')
			})


			describe ('getProperties()', () => {
				it ('returns properties without headers', () => {
					expect(blob.getProperties()).toEqual({
						container: 'mycontainer',
						path: 'mocks/files/hello.txt',
						fullPath: 'mycontainer/mocks/files/hello.txt',
						contentType: 'text/plain',
						md5: 'PXY7+q6AbRLNHH3mNQ99CA=='
					})
				})
			})
		})

		describe('Binary Files', () => {
			const imagePath = jest.requireActual('path').join(__dirname, './../mocks/files/image.png')
			let imageBlob

			beforeEach(() => {
				const originalFs = jest.requireActual('fs')
				const binaryContent = originalFs.readFileSync(imagePath)
				fs.readFileSync.mockReturnValue(binaryContent)
				isBinaryPath.mockReturnValue(true)

				imageBlob = new Blob('./../mocks/files/image.png', opts)
			})

			it ('has an image `contentType`', () => {
				expect(imageBlob.contentType).toEqual('image/png')
			})

			it ('has a Buffer `file.body`', () => {
				expect(Buffer.isBuffer(imageBlob.file.body)).toBe(true)
			})
		})
	})
})