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
			suffix: `${name}?restype=container`,
			params: {
				restype: 'container'
			}
		}
	},

	delete: function (name) {
		return {
			method: 'DELETE',
			suffix: `${name}?restype=container`,
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
			suffix: `${container}?restype=container&comp=list`,
			params: {
				restype: 'container',
				comp: 'list'
			}
		}
	},

	create: function (nameWithContainer) {
		return {
			method: 'PUT',
			suffix: `${nameWithContainer}`
		}
	},

	delete: function (nameWithContainer) {
		return {
			method: 'DELETE',
			suffix: `${nameWithContainer}`
		}
	},

	createSnapshot: function (nameWithContainer, id) {
		return {
			method: 'PUT',
			suffix: `${nameWithContainer}?comp=snapshot`,
			params: {
				comp: 'snapshot'
			}
		}
	},

	deleteSnapshot: function (nameWithContainer, id) {
		return {
			method: 'DELETE',
			suffix: `${nameWithContainer}?snapshot=${id}`,
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
