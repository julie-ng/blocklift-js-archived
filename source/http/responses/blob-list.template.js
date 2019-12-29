function template (response) {
	const blobs = response.data.EnumerationResults.Blobs.Blob
	let data = (blobs)
		? blobs
		: response.data

	// always return an Array
	if (blobs && !Array.isArray(data)) {
		data = [data]
	}
	return data
}

module.exports = template