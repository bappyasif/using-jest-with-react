import { render, screen, getByTestId, waitForElementToBeRemoved, cleanup } from "@testing-library/react"
import UserEvent from '@testing-library/user-event';
import TestableComponent, { CallbackTestingComponent, InputElement, UserInteractionsBits, UserRequestFromApi } from "../../components/testing-tutorial/testable-components"

afterEach(cleanup) // cleans afterwards each test

describe('render various ui tests', () => {
    // render(<TestableComponent />)
    it('is h1 element preset', () => {
        render(<TestableComponent />)
        // To see the HTML output of your component, you could use a method named debug of the screen object.
        screen.debug()
        expect(screen.getByText('Hello World!')).toBeInTheDocument()
        // we could also pass a regular expression to getByText for a partial match. So in our first test, to avoid or mitigate that
        expect(screen.getByText(/Hello/)).toBeInTheDocument()
    })

    // Selecting Elements
    // One caveat of passing a string as an argument to getByText method is that string needs to be an exact match
    // to select the h1 element: React Testing Library provides different query methods for selecting elements
    // Each of those query methods belong to one of the following categories:
    // getBy\*
    // getByAll\*
    // queryBy\*
    // queryAllBy\*
    // findBy\*
    // findAlly\*

    // Following methods belong to the getBy* category of queries:
    // getByText
    // getByRole
    // getByLabelText
    // getByPlaceholderText
    // getByAltText
    // getByDisplayValue

    // following methods can be found under the queryBy* category:
    // queryByText
    // queryByRole
    // queryByLabelText
    // queryByPlaceholderText
    // queryByAltText
    // queryByDisplayValue

    // Selecting Elements using the id Attribute
    it('finding element with id', () => {
        render(<TestableComponent />)
        let elem = screen.getByTestId('some-div')
        // let elem = getByTestId('some-div')
        expect(elem).toHaveTextContent(/Hallo/)
    })

    // The Differences Between Different Query Methods:
    // Generally, the same methods belonging to different categories also work the in same way - the only difference will be that of the category
    // getByText: Selects an element that contains the text passed as an argument to this method
    // getByRole: Selects an element by the accessibility role
    // getByLabelText: Selects an element associated with the label whose htmlFor attribute matches the string passed to this method as an argument.
    // getByPlaceholderText: Selects the element by its placeholder text.
    // getByAltText: Selects an element (normally an img element) with the matching value of alt attribute.
    // getByDisplayValue: Returns the input, textarea, or select element that has the matching display value.

    // The Differences Between Different Query Categories:
    // getBy\*: Query methods in this category return the first matching element or throw an error if no match was found or if more than one match was found.
    // getByAll\*: Query methods in this category return an array of all matching elements or throw an error if no elements matched
    // queryBy\*: Query methods in this category return the first matching element or return null if no elements match. They also throw an error if more than one match is found
    // queryAllBy\*: Query methods in this category return an array of all matching elements or return an empty array if no elements match
    // findBy\*: Query methods in this category return a promise which resolves when an element is found which matches the given query. The promise is rejected if no element is found or if more than one element is found after a default timeout of 1000ms
    // findAllBy\*: Query methods in this category return a promise which resolves to an array of elements when any elements are found which match the given query. The promise is rejected if no elements are found after a default timeout of 1000ms

    // When To Use Which Query Variant:
    // if you want to select an element that is rendered after an asynchronous operation, use the findBy* or findByAll* variants
    // If you want to assert that some element should not be in the DOM, use queryBy* or queryByAll* variants. Otherwise use getBy* and getByAll* variants

    // Assertive Functions: to check if specefic element was in the DOM or not
    // find out:
    // The ul element should be in the document.
    // The ul element should have a class named animals.
    // There should be exactly 5 list items in the ul element.
    test('check if list contain 6 animals or not', () => {
        render(<TestableComponent />)

        let ulElem = screen.getByRole('list')
        let liItems = screen.getAllByRole('listitem')

        expect(ulElem).toBeInTheDocument()
        expect(ulElem).toHaveClass('animals')
        expect(liItems).toHaveLength(6)
        expect(liItems.length).toEqual(6)
    })
})

// Asynchronous Tests
// To test whether the user is fetched from the API and rendered in the DOM, we will mock the fetch function so that we don't make an actual request while testing
// "Mocking" is a good technique for avoiding actual Http requests.
// To mock the fetch function, we will provide our own implementation of the fetch function
// window.fetch = jest.fn(() => {
//     const user = { name: 'Jack', email: 'jack@email.com' };
//     return Promise.resolve({
//         json: () => Promise.resolve(user)
//     });
// });
// This replaces the original fetch method with a custom method which will return a promise but which will not send an actual Http request
// When we render  UserRequestFromApi component, our component will now use this mocked version of our given fetch function
// test cases:
// While the request is in progress, a loading text should be visible.
// Therafter, the user's name should be rendered in the document.
// In case of an error, an error message should be rendered.
describe('asynchronous call with mock and assertions', () => {
    it('check if loading screen is visible', async () => {
        render(<UserRequestFromApi />)
        let laodingElem = screen.getByText(/loading/i)
        expect(laodingElem).toBeInTheDocument()
        await waitForElementToBeRemoved(laodingElem)
    })

    it('check if user name is rendered', async () => {
        render(<UserRequestFromApi />)
        const userName = await screen.findByText('Jack');
        expect(userName).toBeInTheDocument();
    })

    it('render fetch error message', async () => {
        // to enforce an error within our replaced fetch function, we have to tweak it a bit
        window.fetch.mockImplementationOnce(() => {
            return Promise.reject({ message: 'Currently API is down' });
        });
        render(<UserRequestFromApi />)
        screen.debug()
        let errorMsg = screen.findByText('Currently API is down')
        // expect(errorMsg).toBeInTheDocument()
        expect(errorMsg).resolves
    })
})

// Simulating User Interactions
// React Test Library provides an fireEvent API which can be used to trigger events like change on an input element
// React Testing Library also provides another API for simulating use interactions in a separate package named user-event
// For example, fireEvent.change() triggers only a change event whereas UserEvent.type triggers change, keyDown, keyPress and keyUp events
// lets write two tests to assert that counter is incremented and decremented correctly, and group them together
describe('Testing counter', () => {
    it('counter increases on clicking Increment Button', () => {
        render(<UserInteractionsBits />)

        // let counterElem = screen.getByTestId(/Counter/i)
        let counterElem = screen.getByTestId('counter')
        let btnElem = screen.getByText('Increment')

        UserEvent.click(btnElem)
        UserEvent.click(btnElem)

        expect(counterElem.textContent).toBe('2')
        expect(counterElem.textContent).toEqual('2')
    })

    it('counter decreases on clicking Decrement Button', () => {
        render(<UserInteractionsBits />)

        // let counterElem = screen.getByTestId(/Counter/i)
        let counterElem = screen.getByTestId('counter')
        let btnElem = screen.getByText('Decrement')

        UserEvent.click(btnElem)
        UserEvent.click(btnElem)

        expect(counterElem.textContent).toBe('-2')
        expect(counterElem.textContent).toEqual('-2')
    })

    // You might have expected that, as we decrement the counter after incrementing it twice in the first test, the counter's value should be "0" instead of "-2" but that's not the case!
    // That's because the React Testing Library automatically unmounts the React component tree after each test.
})

// Testing Callbacks
// We will write a couple of tests for this case but before we do that, lets create an Input component and also render this Input component in the App component, passing in the required props from the App component to the Input component
describe('testing callback', () => {
    test('check if input value updated correctly', () => {
        render(<CallbackTestingComponent />)
        const input = screen.getByRole('textbox');
        UserEvent.type(input, 'React');
        expect(input.value).toBe('React');
    })
    // We are selecting the input element by its role
    // if we pass any role to this method that is not associated with any element in your component, it will suggest you the available roles once you run the test

    // For our second test, we will test whether or not the handleChange callback function is called every time input value is changed
    test('check input value changes', () => {
        const handleChange = jest.fn();
        render(<InputElement handleChange={handleChange} inputValue='' />)
        const input = screen.getByRole('textbox');
        UserEvent.type(input, 'React');
        expect(handleChange).toHaveBeenCalledTimes(5);
    })
    // we have mocked the handleChange function and then passed it as a prop to the Input component
    // handleChange function has been called 5 times because we typed "React" (= 5 characters) in the input element
})