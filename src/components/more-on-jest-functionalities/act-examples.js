import React, { useEffect, useState } from 'react'

export let SimpleCounter = () => {
    let [ctr, setCtr] = useState(0);
    useEffect(() => {
        setCtr(1);
    }, []);
    return ctr;
}

export let IncrementCounter = () => {
    let [counter, setCounter] = useState(0);
    // return <button onClick={() => setCounter(counter + 1)}>{counter}</button>;
    return <button onClick={() => setCounter(prevCount => prevCount + 1)}>{counter}</button>;
}

export let IncrementCountToOne = () => {
    const [ctr, setCtr] = useState(0);
    useEffect(() => {
        setTimeout(() => setCtr(1), 1000);
    }, []);
    return ctr;
}

export let DemoFetch = () => {
    let [data, setData] = useState(null);
    useEffect(() => {
        fetch("/some/url").then(setData);
        // window.fetch = jest.fn((_resolve) => Promise.resolve(_resolve))

        // window.fetch().then(val=>setData(val))

    }, []);
    return data;
}

export let AnotherAsync = () => {
    let [data, setData] = useState(null);
    async function somethingAsync() {
        // this time we use the await syntax
        let response = await fetch("/some/url");
        setData(response);
    }
    useEffect(() => {
        somethingAsync();
    }, []);
    return data;
}