module.exports = {

	list: function (container) {
		return {
			method: 'GET',
			pathname: container,
			params: {
				restype: 'container',
				comp: 'list'
			}
		}
	},

	create: function (account, blob) {
		return {
			method: 'PUT',
			pathname: account + '/' + blob
		}
	},

	delete: function (account, blob) {
		return {
			method: 'DELETE',
			pathname: account + '/' + blob
		}
	},

	createSnapshot: function (account, blob, id) {
		return {
			method: 'PUT',
			pathname: account + '/' + blob,
			params: {
				comp: 'snapshot'
			}
		}
	},

	deleteSnapshot: function (account, blob, id) {
		return {
			method: 'DELETE',
			pathname: account + '/' + blob,
			params: {
				snapshot: id
			}
		}
	}
}
