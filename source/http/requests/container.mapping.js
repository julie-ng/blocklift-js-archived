module.exports = {

	list: function () {
		return {
			method: 'GET',
			pathname: '',
			params: {
				comp: 'list'
			}
		}
	},

	create: function (name) {
		return {
			method: 'PUT',
			pathname: name,
			params: {
				restype: 'container'
			}
		}
	},

	delete: function (name) {
		return {
			method: 'DELETE',
			pathname: name,
			params: {
				restype: 'container'
			}
		}
	}
}