const required = [
	'sv',
	// 'sr',
	'se',
	'sp',
	'sig'
]

const optional = [
	'ss',
	'srt',
	'sr',
	'st',
	'spr',
	'sip',
	'si'
]

function allParams () {
	const all = {}
	required.forEach(r => {
		all[r] = { required: true }
	})

	optional.forEach(o => {
		all[o] = { required: false }
	})
	return all
}

module.exports = {
	required: required,
	optional: optional,
	all: allParams()
}
