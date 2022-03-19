import React, { useEffect, useState } from "react";
import MapComponent from "./map-comp";

export let HelloComp = ({ name }) => {
    if (name) {
        return <h1>Hello, {name}!</h1>;
    } else {
        return <span>Hey, stranger</span>;
    }
}

// Data Fetching
// Instead of calling real APIs in all your tests, you can mock requests with dummy data.
// Mocking data fetching with “fake” data prevents flaky tests due to an unavailable backend, and makes them run faster
export let UserComp = (id) => {
    const [user, setUser] = useState(null);

    async function fetchUserData(id) {
        const response = await fetch("/" + id);
        setUser(await response.json());
    }

    useEffect(() => {
        fetchUserData(id);
    }, [id]);

    if (!user) {
        return "loading...";
    }

    return (
        <details>
            <summary>{user.name}</summary>
            <strong>{user.age}</strong> years old
            <br />
            lives in {user.address}
        </details>
    );
}

// Mocking Modules
// Some modules might not work well inside a testing environment, or may not be as essential to the test itself. 
// Mocking out these modules with dummy replacements can make it easier to write tests for your own code.
// export let MapComp = () => {
//     return (
//         <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
//             <GoogleMap id="example-map" center={props.center} />
//         </LoadScript>
//     );
// }

export let ContactComp = (props) => {
    return (
        <div>
            <address>
                Contact {props.name} via{" "}
                <a data-testid="email" href={"mailto:" + props.email}>
                    email
                </a>
                or on their <a data-testid="site" href={props.site}>
                    website
                </a>.
            </address>
            <MapComponent center={props.center} />
        </div>
    );
}

// Events
export let ToggleComp = (props) => {
    const [state, setState] = useState(false);
    return (
        <button
            onClick={() => {
                setState(previousState => !previousState);
                props.onChange(!state);
            }}
            data-testid="toggle"
        >
            {state === true ? "Turn off" : "Turn on"}
        </button>
    );
}

// Timers
// Your code might use timer-based functions like setTimeout to schedule more work in the future. 
// In this example, a multiple choice panel waits for a selection and advances, timing out if a selection isn’t made in 5 seconds:
export let CardComp = (props) => {
    useEffect(() => {
        const timeoutID = setTimeout(() => {
            props.onSelect(null);
            // props.onSelect('done');
        }, 5000);
        console.log('here here!!')
        return () => {
            clearTimeout(timeoutID);
        };
    }, [props.onSelect]);

    return [1, 2, 3, 4].map(choice => (
        <button
            key={choice}
            data-testid={choice}
            onClick={() => props.onSelect(choice)}
        >
            {choice}
        </button>
    ));
}