import React from "react";
import { render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";


describe('App component', () => {
    it('renders correct compoennt header', () => {
        // let {getByRole} = render(<App />)
        render(<App />)
        expect(screen.getByRole('heading').textContent).toMatch(/Our First Test/i);
    })
})


// describe("App component", () => {
//     it("renders correct heading", () => {
//         const { screen.getByRole } = render(<App />);
//         expect(getByRole("heading").textContent).toMatch(/our first test/i);
//     });
// });

// describe('App component', () => {
//     it('renders correct compoennt header', () => {
//         // let {getByRole} = render(<App />)
//         // let {screen} = render(<App />)
//         let {getByRole} = render(<App />)
//         expect(getByRole('heading').textContent).toMatch(/TestableComponent - First Test/i);
//     })
// })