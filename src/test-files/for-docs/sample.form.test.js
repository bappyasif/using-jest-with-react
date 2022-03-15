import { getDefaultNormalizer, render, screen } from '@testing-library/react' // (or /dom, /vue, ...)
// import { screen } from '@testing-library/dom'
import SampleForm from '../../components/from-docs/sample-form'

test('should show login form', () => {
  render(<SampleForm />)
  let checkText = screen.getByText('Hello World')
  const input = screen.getByLabelText('Example')

  // Will find the div:

  // Matching a string:
  screen.getByText('Hello World') // full string match
  screen.getByText('llo Worl', { exact: false }) // substring match
  screen.getByText('hello world', { exact: false }) // ignore case

  // Matching a regex:
  screen.getByText(/World/) // substring match
  screen.getByText(/world/i) // substring match, ignore case
  screen.getByText(/^hello world$/i) // full string match, ignore case
  screen.getByText(/Hello W?oRlD/i) // substring match, ignore case, searches for "hello world" or "hello orld"

  // Matching with a custom function:
  screen.getByText((content, element) => content.startsWith('Hello'))

  // Will not find the div:
  // full string does not match
  // screen.getByText('Goodbye World')

  // case-sensitive regex with different case
  // screen.getByText(/hello world/)

  // function looking for a span when it's actually a div:
  // screen.getByText((content, element) => {
  //   return element.tagName.toLowerCase() === 'span' && content.startsWith('Hello')
  // })

  // Normalization Examples
  // To perform a match against text without trimming:
  screen.getByText('Hello World', {
    normalizer: getDefaultNormalizer({ trim: false }),
  })

  // To override normalization to remove some Unicode characters whilst keeping some (but not all) of the built-in normalization behavior:
  screen.getByText('Hello World', {
    normalizer: str =>
      getDefaultNormalizer({ trim: false })(str).replace(/[\u200E-\u200F]*/g, ''),
  })

  // manual queries
  const { container } = render(<SampleForm />)
  const foo = container.querySelector('#example')
})

// Debugging: screen.debug(): 
// for convenience screen also exposes a debug method in addition to queries
// This method is essentially a shortcut for console.log(prettyDOM()). 
// It supports debugging the document, a single element, or an array of elements.

document.body.innerHTML = `
  <button>test</button>
  <span>multi-test</span>
  <div>multi-test</div>
`

// log entire document to testing-playground
screen.logTestingPlaygroundURL()
// log a single element
screen.logTestingPlaygroundURL(screen.getByText('test'))

// document.body.innerHTML = `
//   <button>test</button>
//   <span>multi-test</span>
//   <div>multi-test</div>
// `

// // debug document
// screen.debug()
// // debug single element
// screen.debug(screen.getByText('test'))
// // debug multiple elements
// screen.debug(screen.getAllByText('multi-test'))