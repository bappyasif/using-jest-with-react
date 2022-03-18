import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DemoFavoriteInputComponent from "../../components/more-on-jest-functionalities/demo-favorite-input";

afterEach(cleanup)

// beforeEach(() => {
//     let onChangeMock = jest.fn();
//     render(<DemoFavoriteInputComponent onChange={onChangeMock} />)
// })

let onChangeMock = jest.fn();

describe('Favorite input', () => {
    beforeEach(() => {
        // let onChangeMock = jest.fn();
        render(<DemoFavoriteInputComponent onChange={onChangeMock} />)
    })

    it('calls onChange for a correct number of times', () => {
        // let onChangeMock = jest.fn();
        // render(<DemoFavoriteInputComponent onChange={onChangeMock} />)
        let inputElem = screen.getByRole('textbox')
        userEvent.type(inputElem, 'yeah')
        // expect(inputElem.textContent).toEqual('yeah') // its an input elelmnt it has 'value' not 'textContent'
        expect(onChangeMock).toHaveBeenCalledTimes(4) // passes with flying colors
    })

    it('calls onChange with correct input argument/s', () => {
        // let onChangeMock = jest.fn();
        // render(<DemoFavoriteInputComponent onChange={onChangeMock} />)
        let inputElem = screen.getByRole('textbox')
        userEvent.type(inputElem, 'yeah')
        expect(onChangeMock).toHaveBeenCalledWith('ye')
        expect(onChangeMock).toHaveBeenCalledWith('yeah')
    })

    it('input has correct value', () => {
        // let onChangeMock = jest.fn();
        // render(<DemoFavoriteInputComponent onChange={onChangeMock} />)
        let inputElem = screen.getByRole('textbox')
        userEvent.type(inputElem, 'yeah')
        expect(inputElem).toHaveValue('yeah')
    })
})
// We mock the onChange handler using one of jest features, jest.fn(). For the first test, we assert that the mock function is invoked correct number of times. 
// While the second test ensures that the mock function is called with the correct arguments. The third test seems redundant, and it is; it’s just here to show what other ways we could’ve tested the component.
// But what if you want to set up your mocks in a beforeEach block rather than in every test?
// That’s fine in some cases. Though, having all of the setup for a test in the same block as the test itself makes it easier to understand any particular test as it eliminates the need to check the whole file for context
// This makes the reviewing of subsequent changes in a project down the road substantially easier
// Additionally, it decreases the chance of having leakage create problems throughout the test suite
// Unless your test file is getting really long and the test prep itself is dozens of lines in length, default to setting up in each test case; otherwise, you may use beforeEach