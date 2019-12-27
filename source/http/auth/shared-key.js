let template = function (VERB) {

	// This part of signature is based on headers.
	// The following are optional ones that can be empty.
	// Order matters
	// "Where there is no header value, the new-line character only is specified."
	const params = {
		'Content-Encoding': '',
		'Content-Language': '',
		'Content-Length': '',
		'Content-MD5': '',
		'Content-Type': '',
		'Date': '',
		'If-Modified-Since': '',
		'If-Match': '',
		'If-None-Match': '',
		'If-Unmodified-Since': '',
		'Range': ''
	}

	return `
		VERB + "\n" +
							Content-Encoding + "\n" +
							Content-Language + "\n" +
							Content-Length + "\n" +
							Content-MD5 + "\n" +
							Content-Type + "\n" +
							Date + "\n" +
							If-Modified-Since + "\n" +
							If-Match + "\n" +
							If-None-Match + "\n" +
							If-Unmodified-Since + "\n" +
							Range + "\n" +
							CanonicalizedHeaders +
							CanonicalizedResource;
	`
}

// See: https://docs.microsoft.com/en-gb/rest/api/storageservices/authorize-with-shared-key#constructing-the-canonicalized-headers-string
const generateCanonicalizedHeaders = function (headers = {}) {
	// Retrieve all headers for the resource that begin with x-ms-, including the x-ms-date header.
}


class SharedKey {
	/**
	 *
	 * @param {String} verb - HTTP verb, e.g. `GET`, `PUT`, `DELETE`, etc.
	 * @param {Object} headers={}
	 */
	constructor (verb) {

	}


	generate () {

	}
}

module.exports = SharedKey