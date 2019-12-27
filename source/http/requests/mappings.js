const containerMappings = {

	list: function () {
		return {
			method: 'GET',
			path: '',
			params: {
				comp: 'list'
			}
		}
	},

	create: function (name) {
		return {
			method: 'PUT',
			path: name,
			params: {
				restype: 'container'
			}
		}
	},

	delete: function (name) {
		return {
			method: 'DELETE',
			path: name,
			params: {
				restype: 'container'
			}
		}
	}
}

const blobMappings = {
	list: function (container) {
		return {
			method: 'GET',
			path: container,
			params: {
				restype: 'container',
				comp: 'list'
			}
		}
	},

	create: function (nameWithContainer) {
		return {
			method: 'PUT',
			path: nameWithContainer
		}
	},

	delete: function (nameWithContainer) {
		return {
			method: 'DELETE',
			path: nameWithContainer
		}
	},

	createSnapshot: function (nameWithContainer, id) {
		return {
			method: 'PUT',
			path: nameWithContainer,
			params: {
				comp: 'snapshot'
			}
		}
	},

	deleteSnapshot: function (nameWithContainer, id) {
		return {
			method: 'DELETE',
			path: nameWithContainer,
			params: {
				snapshot: id
			}
		}
	}
}

module.exports = {
	container: containerMappings,
	blob: blobMappings
}
