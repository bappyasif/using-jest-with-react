import { render, screen } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom'
import { act, findAllInRenderedTree, findRenderedDOMComponentWithTag, isCompositeComponent, isCompositeComponentWithType, isDOMComponent, isElement, renderIntoDocument, scryRenderedDOMComponentsWithClass, scryRenderedDOMComponentsWithTag, Simulate } from 'react-dom/test-utils';
import { CounterAsClassComponent, CounterAsFunctionalComp } from '../../components/react-testing-utilities/examples';
let container;

beforeEach(() => {
    container = document.createElement('div');
    // document.appendChild(container)
    document.body.appendChild(container)
})

afterEach(() => {
    document.body.removeChild(container)
    container = null
})

describe('using react test utilities', () => {
    it('class component can render and update a counter', () => {
        // testing componentDidMount
        act(() => ReactDOM.render(<CounterAsClassComponent />, container))
        const button = container.querySelector('button');
        const label = container.querySelector('p');
        expect(label.textContent).toBe('You clicked 0 times');
        expect(document.title).toEqual('You clicked 0 times');
        // expect(document.title).toHaveValue('You clicked 0 times');

        // testing componentDidUpdate
        act(() => button.dispatchEvent(new MouseEvent('click', { bubbles: true })))
        expect(label.textContent).toBe('You clicked 1 times');
        expect(document.title).toBe('You clicked 1 times');
    })

    it('functional component can render and update a counter', () => {
        act(() =>  render(<CounterAsFunctionalComp />, container))
        let btnElem = screen.getByRole('button');
        // let labelElem = screen.getByRole('paragraph');
        // let labelElem = screen.getByText('paragraph'); // as paragraph is not a valid tag name defined in getByRole
        // let labelElem = screen.getByDisplayValue('you clicked 0 times')
        // expect(labelElem.textContent).toBe('you clicked 0 times');
        // let labelElem = container.querySelector('p');
        // expect(labelElem.textContent).toBe('you clicked 0 times');
        // expect(labelElem.innerHTML).toBe('you clicked 0 times');
        // expect(screen.getByRole('paragraph').textContent).toBeInTheDocument()
        expect(document.title).toEqual('you clicked 0 times');

        act(() => btnElem.dispatchEvent(new MouseEvent('click', {bubbles: true})))
        expect(document.title).toBe('you clicked 1 times')

        expect(isElement(btnElem)).toBe(false)
        expect(isElement(<CounterAsFunctionalComp />)).not.toBe(false)

        expect(isDOMComponent(btnElem)).toBe(true)
        // expect(isCompositeComponent(<CounterAsFunctionalComp />)).toBe(true) // Returns true if instance is a user-defined component, such as a class or a function.

        // expect(isCompositeComponentWithType(<CounterAsClassComponent />, React.Component)).toBe(true)

        // Traverse all components in tree and accumulate all components where test(component) is true. This is not that useful on its own, but it’s used as a primitive for other test utils.
        // expect(findAllInRenderedTree(<CounterAsClassComponent />)).toBeInTheDocument()

        // Finds all DOM elements of components in the rendered tree that are DOM components with the class name matching className.
        // expect(scryRenderedDOMComponentsWithClass(CounterAsClassComponent, ''))
        
        // Like scryRenderedDOMComponentsWithClass() but expects there to be one result, and returns that one result, or throws exception if there is any other number of matches besides one
        // findRenderedDOMComponentWithClass()

        // Finds all DOM elements of components in the rendered tree that are DOM components with the tag name matching tagName
        // let test = scryRenderedDOMComponentsWithTag('Click Me', 'button').length
        let compInstance = renderIntoDocument(<CounterAsFunctionalComp />)
        // let test = scryRenderedDOMComponentsWithTag(<CounterAsFunctionalComp />, 'button').length
        let test = scryRenderedDOMComponentsWithTag(compInstance, 'p').length
        // expect(test).toBe(1)
        // test = findRenderedDOMComponentWithTag(compInstance, 'button')
        // expect(test).toBe(true)

        // Same as scryRenderedComponentsWithType() but expects there to be one result and returns that one result, or throws exception if there is any other number of matches besides one
        // findRenderedComponentWithType()

        // Render a React element into a detached DOM node in the document. This function requires a DOM. and equivalent to RectDOM.render
        // renderIntoDocument()

        // Simulate an event dispatch on a DOM node with optional eventData event data.
        // expect(Simulate.click(btnElem)).toHaveBeenCalled()
    })
})

// mockComponent() is a legacy API. use jest.mock() instead.