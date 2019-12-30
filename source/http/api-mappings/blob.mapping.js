/**
 * Note: `url` is relative.
 */
module.exports = {

	list: function (container) {
		return {
			method: 'GET',
			url: container,
			params: {
				restype: 'container',
				comp: 'list'
			}
		}
	},

	create: function (container, blob) {
		return {
			method: 'PUT',
			url: container + '/' + blob
		}
	},

	delete: function (container, blob) {
		return {
			method: 'DELETE',
			url: container + '/' + blob
		}
	},

	createSnapshot: function (container, blob, id) {
		return {
			method: 'PUT',
			url: container + '/' + blob,
			params: {
				comp: 'snapshot'
			}
		}
	},

	deleteSnapshot: function (container, blob, id) {
		return {
			method: 'DELETE',
			url: container + '/' + blob,
			params: {
				snapshot: id
			}
		}
	}
}
