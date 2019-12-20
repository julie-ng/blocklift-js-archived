require('dotenv').config()
const Blockport = require('./src/blockport')

const blobService = process.env.BLOB_SERVICE_SAS_URL

const blockport = new Blockport({
	account: 'enterpriseuploadspoc', // should be optional if serviceUrl provided
	serviceUrl: blobService // Todo: how to handle scenario account + account keys?
})

/**
 * Containers
 *
 * Prioritized:
 * - list
 * - exists?
 * - delete
 *
 * Later:
 * - get properties
 * - set properties
 * - get ACL
 * - set ACL
 * - lease??
 */

blockport.listContainers()
	.then((data) => {
		console.log('Containers [info] - list:')
		console.log(data)
	})
	.catch((err) => {
		console.log('Containers [error]')
		console.error(err)
	})


// const name = 'test-' + new Date().getMilliseconds()

// blockport.createContainer(name)
// 	.then((data) => {
// 		console.log(`Containers [INFO] created '${name}'`)
// 		console.log(data)
// 	})
// 	.catch((err) => {
// 		console.log('Containers [error]')
// 		console.error(err)
// 	})


// blockport.deleteContainer('test-820')

/**
 * Blob
 *
 * Prioritized:
 * - list
 * - create
 * - upload file / put (what can change here?)
 * - delete
 *
 * Later:
 * - copy
 * - upload stream?
 * - multipart upload?*
 * - get/set metadata
 * - get/set properties
 * - get/download?
 * - create snapshot?
 */

// let params = {
// 	container: 'container',
// 	prefix: 'prefix'
// }
// blockport.listObjects(params, (data, err) => {})
// blockport.listObjects(params)
// 	.then((data) => {})
// 	.error((err) => {})



