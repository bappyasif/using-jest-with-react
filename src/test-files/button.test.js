import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestableButton from "../components/testable-button";

describe("App component", () => {
    // In the first test, we utilize snapshots to check whether all the nodes render as we expect them to
    it("renders magnificent monkeys", () => {
        // since screen does not have the container property, we'll destructure render to obtain container for this test
        const { container } = render(<TestableButton />);
        expect(container).toMatchSnapshot();
    });

    // In the second test, we simulate a click event. Then we check if the heading changed. toMatch is one of the various assertions we could have made.
    it("renders radical rhinos after button click", () => {
        render(<TestableButton />);
        const button = screen.getByRole("button", { name: "Click Me" });

        userEvent.click(button);

        expect(screen.getByRole("heading").textContent).toMatch(/radical rhinos/i);
    });

    // It’s also important to note that after every test, React Testing Library unmounts the rendered components.
    // That’s why we render for each test. For a lot of tests for a component, the beforeEach jest function could prove handy.

    // Snapshot tests are fast and easy to write. One assertion saves us from writing multiple lines of code. 
    // For example, with a toMatchSnapshot, we’re spared of asserting the existence of the button and the heading.

});