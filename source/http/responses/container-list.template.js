function template (response) {
	const containers = response.data.EnumerationResults.Containers.Container
	let data = (containers)
		? containers
		: response.data

	// always return an Array
	if (containers && !Array.isArray(data)) {
		data = [data]
	}
	return data
}

module.exports = template