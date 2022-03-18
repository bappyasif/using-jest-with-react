// Setup/Teardown
// For each test, we usually want to render our React tree to a DOM element that’s attached to document
// his is important so that it can receive DOM events. When the test ends, we want to “clean up” and unmount the tree from the document.

// const { render } = require("@testing-library/react");
// const { unmountComponentAtNode } = require("react-dom");
// const { act } = require("react-dom/test-utils");
// const { HelloComp } = require("../../components/react-testing-recipes/examples");
import { ContactComp, HelloComp, UserComp } from "../../components/react-testing-recipes/examples"
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { screen } from "@testing-library/dom";
import MapComponent from "../../components/react-testing-recipes/map-comp";

// A common way to do it is to use a pair of beforeEach and afterEach blocks so that they’ll always run and isolate the effects of a test to itself:
let container = null;
beforeEach(() => {
    // setup a dom element as a render target
    container = document.createElement('div')
    document.body.append(container)
})

afterEach(() => {
    // cleaning up on existing
    unmountComponentAtNode(container)
    container.remove()
    container = null;
})
// keep in mind that we want to execute the cleanup even if a test fails. Otherwise, tests can become “leaky”, and one test can change the behavior of another test. That makes them difficult to debug.

// act()
// When writing UI tests, tasks like rendering, user events, or data fetching can be considered as “units” of interaction with a user interface
// react-dom/test-utils provides a helper called act() that makes sure all updates related to these “units” have been processed and applied to the DOM before you make any assertions
// This helps make your tests run closer to what real users would experience when using your application

// Rendering: Commonly, you might want to test whether a component renders correctly for given props:
describe('simple assertions', () => {
    it('renders with or without a name', () => {
        act(() => render(<HelloComp />, container))
        expect(container.textContent).toBe("Hey, stranger");

        act(() => {
            render(<HelloComp name="Jenny" />, container);
        });
        expect(container.textContent).toBe("Hello, Jenny!");

        act(() => {
            render(<HelloComp name="Margaret" />, container);
        });
        expect(container.textContent).toBe("Hello, Margaret!");
    })
})

// fetching data
describe('fetching data', () => {
    it('renders user data', async () => {
        const fakeUser = {
            name: "Joni Baez",
            age: "32",
            address: "123, Charming Avenue"
        };
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(fakeUser)
            })
        );

        // Use the asynchronous version of act to apply resolved promises
        await act(async () => {
            render(<UserComp id="123" />, container);
        });

        expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
        expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
        expect(container.textContent).toContain(fakeUser.address);
        // expect(screen.getByRole())

        // remove the mock to ensure tests are completely isolated
        global.fetch.mockRestore();
    })
})

// Mocking Modules
// If we don’t want to load this component (Map, ContactComp) in our tests, we can mock out the dependency itself to a dummy component, and run our tests
jest.mock("../../components/react-testing-recipes/map-comp", () => {
    return function DummyMap(props) {
        return (
            <div data-testid="map">
                {props.center.lat}:{props.center.long}
            </div>
        );
    };
});
describe('using a mock function', () => {
    it('should render contact information', () => {
        const center = { lat: 0, long: 0 };
        // act(() => render(<ContactComp name="Joni Baez" email="test@example.com" site="http://test.com" center={center} />, container));
        // act(() => {
        //     render(
        //         <ContactComp
        //             name="Joni Baez"
        //             email="test@example.com"
        //             site="http://test.com"
        //             center={center}
        //         />,
        //         container
        //     );
        // });
        // expect(
        //     container.querySelector("[data-testid='email']").getAttribute("href")
        // ).toEqual("mailto:test@example.com");
    })
})