const fs = require('fs')
const BlockBlob = require('./block-blob')
const isBinaryPath = require('is-binary-path')

jest.mock('fs')
jest.mock('is-binary-path')

describe ('BlockBlob', () => {
	let blob
	const opts = { container: 'container' }

	describe ('Constructor()', () => {
		beforeEach(() => {
			fs.readFileSync.mockReturnValue('My content')
			isBinaryPath.mockReturnValue(false)
			blob = new BlockBlob('hello.txt', opts)
		})

		it ('throws if missing `container` param', () => {
			expect(() => {
				new BlockBlob('file.txt')
			}).toThrow('BlockBlob: missing required `container` property')
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
			const spy = jest.spyOn(BlockBlob.prototype, 'readSync')
			new BlockBlob('foo.txt', opts)
			expect(spy).toHaveBeenCalledTimes(1)
			spy.mockRestore()
		})
	})

	describe('Properties', () => {
		beforeEach(() => {
			fs.readFileSync.mockReturnValue('My content')
			isBinaryPath.mockReturnValue(false)
			blob = new BlockBlob('./../mocks/files/hello.txt', {
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
					let b = new BlockBlob(source, opts)
					expect(b.path).toEqual('a/b.txt')
				})

				it ('also removes relative paths', () => {
					let b = new BlockBlob('./' + source, opts)
					let c = new BlockBlob('./../' + source, opts)
					let d = new BlockBlob('../' + source, opts)
					expect(b.path).toEqual('a/b.txt')
					expect(c.path).toEqual('a/b.txt')
					expect(d.path).toEqual('a/b.txt')
				})

				it ('also removes absolute path', () => {
					let b = new BlockBlob('/' + source, opts)
					expect(b.path).toEqual('a/b.txt')
				})
			})

			it ('has a `url` property, with name and container', () => {
				expect(blob.url).toEqual('mycontainer/mocks/files/hello.txt')
			})


			describe ('getProperties()', () => {
				it ('returns properties without headers', () => {
					expect(blob.getProperties()).toEqual({
						container: 'mycontainer',
						path: 'mocks/files/hello.txt',
						url: 'mycontainer/mocks/files/hello.txt',
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

				imageBlob = new BlockBlob('./../mocks/files/image.png', opts)
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