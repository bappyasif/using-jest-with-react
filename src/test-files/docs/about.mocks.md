What is Mocking:
Mocking is a replacement of real life action about something, it is done using mock function from jest library to replace intended functional or functionlity when needed for testing purpose

Testing Callback Handlers:
Callbacks are ubiquitous, every avenue of user interaction requires it, some times they are passed as props to update parent component's state

Mocking Child Components:
You might have come across the concept of mocking modules. In React, when the component tree gets large, tests can become convoluted.
Especially for components higher up the tree. That’s why we mock child components.
This is not something you’ll come across often, nevertheless, it’s beneficial to realize the concept in case you might need it in your own testing pursuits.


## secrets of the act(...) api
wrap your test interactions with act(() => ...). React will take care of the rest
React doesn't just 'synchronously' render the whole UI everytime you poke at it. It divides its work into chunks (called, er, 'work' 🙄), and queues it up in a scheduler
```js
function App() {
  let [ctr, setCtr] = useState(0);
  useEffect(() => {
    setCtr(1);
  }, []);
  return ctr;
}
```
and attempted test script:
```js
it("should render 1", () => {
  const el = document.createElement("div");
  ReactDOM.render(<App />, el);
  expect(el.innerHTML).toBe("1"); // this fails!
});
```
but this will fails saying, expected 1 but recieved 0; and here is why:
We can now see the problem. We run our test at a point in time when react hasn't even finished updating the UI
    <> by using useLayoutEffect instead of useEffect: while this would pass the test, we've changed product behaviour for no good reason, and likely to its detriment.
    <> by waiting for some time, like 100ms or so: this is pretty ick, and might not even work depending on your setup.
Neither of these solutions are satisfying; we can do much better. In 16.8.0, we introduced a new testing api act(...). It guarantees 2 things for any code run inside its scope:
    <> any state updates will be executed
    <> any enqueued effects will be executed
Further, React will warn you when you try to "set state" outside of the scope of an act(...) call. (ie - when you call the 2nd return value from a useState/useReducer hook)
Let's rewrite our test with this new api:
```js
it("should render 1", () => {
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("1"); // this passes!
});
```
In short, "act" is a way of putting 'boundaries' around those bits of your code that actually 'interact' with your React app - these could be user interactions, apis, custom event handlers and subscriptions firing; anything that looks like it 'changes' something in your ui
React will make sure your UI is updated as 'expected', so you can make assertions on it
You can even nest multiple calls to act, composing interactions across functions, but in most cases you wouldn't need more than 1-2 levels of nesting

## events: Let's look at another example; this time, events:
```js
function App() {
  let [counter, setCounter] = useState(0);
  return <button onClick={() => setCounter(counter + 1)}>{counter}</button>;
}
```
Let's write a test for it:
```js
it("should increment a counter", () => {
  const el = document.createElement("div");
  document.body.appendChild(el);
  // we attach the element to document.body to ensure events work
  ReactDOM.render(<App />, el);
  const button = el.childNodes[0];
  for (let i = 0; i < 3; i++) {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
  expect(button.innerHTML).toBe("3");
});
```
but when tweaking existing test a bit, we face discrepencies:
```js
act(() => {
  for (let i = 0; i < 3; i++) {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});
expect(button.innerHTML).toBe(3); // this fails, it's actually "1"!
```
The test fails, and button.innerHTML claims to be "1"!
But act has uncovered a potential bug here - if the handlers are ever called close to each other, it's possible that the handler will use stale data and miss some increments.
The 'fix' is simple - we rewrite with 'setState' call with the updater form ie - setCounter(x => x + 1), and the test passes
This demonstrates the value act brings to grouping and executing interactions together, resulting in more 'correct' code

timers: How about stuff based on timers? Let's write a component that 'ticks' after one second:
```js
function App() {
  const [ctr, setCtr] = useState(0);
  useEffect(() => {
    setTimeout(() => setCtr(1), 1000);
  }, []);
  return ctr;
}
```
Let's write a test for this:
```js
it("should tick to a new value", () => {
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("0");
  // ???
  expect(el.innerHTML).toBe("1");
});
```
What could we do here?

Option 1 - Let's lean on jest's timer mocks.

```js
it("should tick to a new value", () => {
  jest.useFakeTimers();
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("0");
  jest.runAllTimers();
  expect(el.innerHTML).toBe("1");
});
```
Better! We were able to convert asynchronous time to be synchronous and manageable. We also get the warning; when we ran runAllTimers(), the timeout in the component resolved, triggering the setState. Like the warning advises, we mark the boundaries of that action with act(...). Rewriting the test:
```js
it("should tick to a new value", () => {
  jest.useFakeTimers();
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("0");
  act(() => {
    jest.runAllTimers();
  });
  expect(el.innerHTML).toBe("1");
});
```
Option 2 - Alternately, let's say we wanted to use 'real' timers. This is a good time to introduce the asynchronous version of act. 
```js
it("should tick to a new value", async () => {
  // a helper to use promises with timeouts
  function sleep(period) {
    return new Promise(resolve => setTimeout(resolve, period));
  }
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("0");
  await act(async () => {
    await sleep(1100); // wait *just* a little longer than the timeout in the component
  });
  expect(el.innerHTML).toBe("1");
});
```
This simplifies a lot of rough edges with testing asynchronous logic in components.
we don't have to mess with fake timers or builds anymore, and can write tests more 'naturally'
While it's less restrictive than the synchronous version, it supports all its features, but in an async form
The api makes some effort to make sure you don't interleave these calls, maintaining a tree-like shape of interactions at all times

## promises
This time, let's use promises. Consider a component that fetches data with, er, fetch -
```js
function App() {
  let [data, setData] = useState(null);
  useEffect(() => {
    fetch("/some/url").then(setData);
  }, []);
  return data;
}
```
Let's write a test again. This time, we'll mock fetch so we have control over when and how it responds:
```js
it("should display fetched data", () => {
  // a rather simple mock, you might use something more advanced for your needs
  let resolve;
  function fetch() {
    return new Promise(_resolve => {
      resolve = _resolve;
    });
  }

  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("");
  resolve(42);
  expect(el.innerHTML).toBe("42");
});
```
The test passes, but we get the warning again. Like before, we wrap the bit that 'resolves' the promise with act(...)
```js
// ...
expect(el.innerHTML).toBe("");
await act(async () => {
  resolve(42);
});
expect(el.innerHTML).toBe("42");
// ...
```
This time, the test passes, and the warning's disappeared.

## async / await: 
```js
function App() {
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
```
And run the same test on it -
```js
it("should display fetched data", async () => {
  // a rather simple mock, you might use something more advanced for your needs
  let resolve;
  function fetch() {
    return new Promise(_resolve => {
      resolve = _resolve;
    });
  }
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("");
  await act(async () => {
    resolve(42);
  });
  expect(el.innerHTML).toBe("42");
});
```
Literally the same as the previous example. All good and green. Niccce.

