module.exports = {

	list: function () {
		return {
			method: 'GET',
			url: '',
			params: {
				comp: 'list'
			}
		}
	},

	create: function (name) {
		return {
			method: 'PUT',
			url: name,
			params: {
				restype: 'container'
			}
		}
	},

	delete: function (name) {
		return {
			method: 'DELETE',
			url: name,
			params: {
				restype: 'container'
			}
		}
	}
}