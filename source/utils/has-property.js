/**
 * Safer `hasOwnProperty()` per Eslint recommendation
 * https://eslint.org/docs/rules/no-prototype-builtins
 *
 * @param {Object} obj - object to check for property
 * @param {String} prop - property to check for
 * @return {Boolean}
 */
function hasProperty (obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop)
}

module.exports = hasProperty