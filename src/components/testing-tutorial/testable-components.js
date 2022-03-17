import React, { useEffect, useState } from 'react'

function TestableComponent() {
    return (
        <div>
            TestableComponent
            <h1>Hello World!</h1>
            <div data-testid='some-div'>Hallo Wereld</div>
            <ul className="animals">
                <li>Cat</li>
                <li>Whale</li>
                <li>Lion</li>
                <li>elephant</li>
                <li>Rhino</li>
                <li>Bird</li>
            </ul>
        </div>
    )
}

export let UserRequestFromApi = () => {
    let [user, setUser] = useState(null)
    let [error, setError] = useState(null)

    // useEffect(() => {
    //     fetch('https://jsonplaceholder.typicode.com/users/1')
    //         .then((response) => response.json())
    //         .then((user) => setUser(user))
    //         .catch((error) => setError(error.message));
    // }, [])

    useEffect(() => {
        // mock function to replace native fetch
        window.fetch = jest.fn(() => {
            const user = { name: 'Jack', email: 'jack@email.com' };

            return Promise.resolve({
                json: () => Promise.resolve(user),
            });
        });

        window.fetch()
            .then((response) => response.json())
            .then((user) => setUser(user))
            .catch((error) => setError(error.message));
    }, [])

    if (error) {
        return <span>{error}</span>;
    }

    return <div>{user ? <UserCardInfo user={user} /> : <span>Loading...</span>}</div>;
}

export let UserCardInfo = ({ user }) => {
    let { name, email } = { ...user }
    return (
        <div className="person">
            <h3>{name}</h3>
            <div>{email}</div>
        </div>
    )
}

export let CallbackTestingComponent = () => {
    const [inputValue, setInputValue] = React.useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div>
            <InputElement handleChange={handleChange} inputValue={inputValue} />
        </div>
    );
}

export function InputElement(props) {
    const { handleChange, inputValue } = props;
    return <input onChange={handleChange} value={inputValue} />;
}

export let UserInteractionsBits = () => {
    const [counter, setCounter] = React.useState(0);

    const increment = () => {
        setCounter((prevCounter) => ++prevCounter);
    };

    const decrement = () => {
        setCounter((prevCounter) => --prevCounter);
    };

    return (
        <div>
            <h2 data-testid="counter">{counter}</h2>
            <button onClick={decrement}>Decrement</button>
            <button onClick={increment}>Increment</button>
        </div>
    );
}

// window.fetch = jest.fn(() => {
//     const user = { name: 'Jack', email: 'jack@email.com' };

//     return Promise.resolve({
//         json: () => Promise.resolve(user),
//     });
// });

export default TestableComponent