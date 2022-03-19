import React, { useEffect, useState } from "react"

export let CounterAsFunctionalComp = () => {
    let [counter, setCounter] = useState(0)

    let handleClick = () => setCounter(counter + 1)

    useEffect(() => document.title = `you clicked ${counter} times`, [counter])

    return (
        <div>
            <p>You clicked {counter} times</p>
            <button onClick={handleClick}>
                Click me
            </button>
        </div>
    );
}

export class CounterAsClassComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = { count: 0 }
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        document.title = `You clicked ${this.state.count} times`
    }

    componentDidUpdate() {
        document.title = `You clicked ${this.state.count} times`
    }

    handleClick = () => this.setState(state => ({ count: state.count + 1 }))

    render() {
        return (
            <div>
                <p>You clicked {this.state.count} times</p>
                <button onClick={this.handleClick}>
                    Click me
                </button>
            </div>
        );
    }
}