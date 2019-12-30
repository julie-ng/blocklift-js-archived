const helper = require('./xml-helper')

const exampleXML = `<?xml version="1.0" encoding="utf-8"?>
<List>
	<Foo>Bar</Foo>
	<Hello>World</Hello>
</List>
`

describe ('XML helper', () => {
	describe ('with a XML param', () => {
		it ('transforms it into a JS object', () => {
			expect(helper(exampleXML)).toEqual({
				List: {
					Foo: 'Bar',
					Hello: 'World'
				}
			})
		})
	})

	describe ('with object param', () => {
		it ('just returns the object', () => {
			let obj = {
				foo: 'bar',
				hello: 'world'
			}
			expect(helper(obj)).toEqual(obj)
		})
	})
})