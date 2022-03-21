import React from "react";
import ReactDOM from 'react-dom'
import { act, render, screen } from "@testing-library/react";
import { DemoFetch, IncrementCounter, IncrementCountToOne, SimpleCounter } from "../../components/more-on-jest-functionalities/act-examples";

describe('count checks', () => {
    it("should it render 1", () => {
        const el = document.createElement("div");
        render(<SimpleCounter />, el);
        // ReactDOM.render(<SimpleCounter />, el);
        expect(el.innerHTML).not.toBe("1"); // this fails!
    });

    // Further, React will warn you when you try to "set state" outside of the scope of an act(...) call. (ie - when you call the 2nd return value from a useState/useReducer hook)
    // Let's rewrite our test with this new api:
    it('should render 1', () => {
        const el = document.createElement("div");
        act(() => {
            // render(<SimpleCounter />, el);
            ReactDOM.render(<SimpleCounter />, el);
        })
        expect(el.innerHTML).toBe("1");
    })
})

// events: involving user events:
describe('check user interactions with counter increment', () => {
    it('counter should increases count', () => {
        const el = document.createElement("div");
        document.body.appendChild(el);
        // we attach the element to document.body to ensure events work
        render(<IncrementCounter />)
        const button = el.childNodes[0];
        // for (let i = 0; i < 3; i++) {
        //     console.log(button, el, el.childNodes[0], '?!?!')
        //     button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        // }
        // expect(button.innerHTML).toBe('3')
        screen.debug()
    })
})

// timer
describe('checking with timer scenarios', () => {
    // Option 1 - Let's lean on jest's timer mocks
    it('counter changes to a new value', () => {
        let el = document.createElement('div');
        // render(<IncrementCountToOne />, el)
        // ReactDOM.render(<IncrementCountToOne />, el)
        // let el = document.createElement('div');

        act(() => ReactDOM.render(<IncrementCountToOne />, el))
        expect(el.innerHTML).toBe('0')
        // jest.runAllTimers() // it doesnt really encompass act functionlity as expected, we have to use it within act()
        act(() => jest.runAllTimers())
        expect(el.innerHTML).not.toBe('1') // it should be 1 after a second
        // expect(el.innerHTML).toBe('1')
    })

    // Option 2 - Alternately, let's say we wanted to use 'real' timers. This is a good time to introduce the asynchronous version of act. 
    it('should tick to a new value', async () => {
        // a helper to use promises with timeouts
        let sleepTimer = period => new Promise(resolve => setTimeout(resolve, period))
        let el = document.createElement('div')
        // act(() => render(<IncrementCountToOne />, el))
        act(() => ReactDOM.render(<IncrementCountToOne />, el))
        expect(el.innerHTML).toBe('0')
        await act(async () => await sleepTimer(1100))
        expect(el.innerHTML).toBe('1')
    })
})

// Promises:
describe('using promise for fetch', () => {
    test('should display fetched data', async () => {
        // a rather simple mock, you might use something more advanced for your needs
        let resolve;
        fetch = jest.fn(() => new Promise(_resolve => resolve = _resolve))
    
        let el = document.createElement('div')
        
        act(() => ReactDOM.render(<DemoFetch />, el))
        expect(el.innerHTML).toBe("");

        await act(async () => {
            resolve(42);
        });
        expect(el.innerHTML).toBe("42");
    })
})

// async / await:
describe('fetching data with async', () => {
    it('same test as before', async () => {
        let resolve;
        fetch = () => new Promise(_resolve => resolve = _resolve)
        // let fetch = (value) => new Promise(_resolve => resolve = value)
        let el = document.createElement('div')
        act(() => ReactDOM.render(<DemoFetch />, el))
        expect(el.innerHTML).toBe("");
        await act(async () => {
            resolve(42);
        });
        expect(el.innerHTML).toBe("42");
    })
})

/**
 * 
 * 
 describe('using promise for fetch', () => {
    test('should display fetched data', async () => {
        // a rather simple mock, you might use something more advanced for your needs
        let resolve;
        // let fetch = () => new Promise(_resolve => resolve = _resolve) // this would have worked if component was already included in test file, which is highly unlikely most of use cases

        // fetch = jest.fn(() => new Promise(_resolve => resolve = _resolve))
        // let fetch = (value) => new Promise(_resolve => resolve = value)
        fetch = jest.fn(() => new Promise(_resolve => resolve = _resolve))
        
        let el = document.createElement('div')
        act(() => ReactDOM.render(<DemoFetch />, el))
        expect(el.innerHTML).toBe("");
        // resolve(42);
        // fetch(42)
        // expect(el.innerHTML).toBe("42");

        await act(async () => {

            // Promise.resolve(42);
            resolve(42);
            // fetch(42)
        });
        expect(el.innerHTML).toBe("42");
    })
})
 */