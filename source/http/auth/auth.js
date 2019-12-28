const utils = require('../../utils')
const classProperties = ['account', 'sharedKey', 'serviceUrl', 'type']

const COMBINATIONS = {
	serviceUrl: ['serviceUrl'],
	sharedKey: ['account', 'sharedKey']
}

let _auth

/**
 * Authentication Wrapper
 *
 * @prop {String} [account = null]
 * @prop {String} [sharedKey = null]
 * @prop {String} [serviceUrl = null]
 * @prop {String} [authMethod = null]
 */
class BlobAuth {
	constructor (opts = {}) {
		_auth = {}

		// set defaults
		classProperties.forEach(p => {
			// this[p] = null
			_auth[p] = null
		})

		const types = Object.keys(COMBINATIONS)
		for (const i in types) {
			const type = types[i]
			// console.log(`...checking for type ${type}`)

			if (isAuthType(opts, type)) {
				_auth.type = type
				setAttrs(opts, type, _auth)
				break
			}
		}

		if (_auth.method === null) {
			throw `invalid params`
		}
	}

	get (prop) {
		// console.log('get() _auth', _auth)
		if (classProperties.indexOf(prop) > -1) {
			return _auth[prop]
		} else {
			return 'Error: invalid property'
		}
	}

	getType () {
		return _auth.type
	}

	getAccount () {
		return _auth.account
	}

	getSharedKey () {
		return _auth.sharedKey
	}

	getServiceUrl () {
		return _auth.serviceUrl
	}

	_debug () {
		console.log('debug()')
		console.log(_auth)
	}
}

function isAuthType (params, type) {
	// console.log(`_isAuthType(params, ${type})`, params)
	const requiredKeys = COMBINATIONS[type]
	for (const i in requiredKeys) {
		if (!utils.hasProperty(params, requiredKeys[i])) {
			return false
		}
	}
	return true
}

function setAttrs (params, type, ref) {
	COMBINATIONS[type].forEach((key) => {
		ref[key] = params[key]
	})
}

module.exports = BlobAuth
