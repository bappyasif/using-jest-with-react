Guiding Principles
<> If it relates to rendering components, then it should deal with DOM nodes rather than component instances, and it should not encourage dealing with component instances.
<> It should be generally useful for testing the application components in the way the user would use it. We are making some trade-offs here because we're using a computer and often a simulated browser environment, but in general, utilities should encourage tests that use the components the way they're intended to be used.
<> Utility implementations and APIs should be simple and flexible.


Priority
<1> Queries Accessible to Everyone
    [] getByRole: This can be used to query every element that is exposed in the accessibility tree, With the name option you can filter the returned elements by their accessible name, this should be our top preference for just about everything.
    [] getByLabelText: This method is really good for form fields. When navigating through a website form, users find elements using label text. This method emulates that behavior, so it should be your top preference.
    [] getByPlaceholderText:  A placeholder is not a substitute for a label. But if that's all we have, then it's better than alternatives.
    [] getByText: Outside of forms, text content is the main way users find elements. This method can be used to find non-interactive elements (like divs, spans, and paragraphs).
    [] getByDisplayValue: The current value of a form element can be useful when navigating a page with filled-in values.
<2> Semantic Queries (the user experience of interacting with these attributes varies greatly across browsers and assistive technology)
    [] getByAltText:  If your element is one which supports alt text (img, area, input, and any custom element), then you can use this to find that element.
    [] getByTitle: The title attribute is not consistently read by screenreaders, and is not visible by default for sighted users
<3> Test IDs
    [] getByTestId: The user cannot see (or hear) these, so this is only recommended for cases where you can't match by role or text or it doesn't make sense (e.g. the text is dynamic).

Queries are the methods that Testing Library gives you to find elements on the page.
There are several types of queries ("get", "find", "query") 
the difference between them is whether the query will throw an error if no element is found or if it will return a Promise and retry.
Depending on what page content you are selecting, different queries may be more or less appropriate

Precision: Queries that take a TextMatch also accept an object as the final argument that can contain options that affect the precision of string matching:
    exact: Defaults to true; matches full strings, case-sensitive. When false, matches substrings and is not case-sensitive.
        exact has no effect on regex or function arguments.
        In most cases using a regex instead of a string gives you more control over fuzzy matching and should be preferred over { exact: false }.
    normalizer: An optional function which overrides normalization behavior. See Normalization.


As stated by the React Testing Library docs, ByRole methods are the favored methods for querying, especially when paired with the name option. 
For example, we could improve the specificity of the above query like so: getByRole("heading", { name: "Our First Test" }). Queries that are done through ByRole ensure that our UI is accessible to everyone no matter what mode they use to navigate the webpage (i.e mouse or assistive technologies.


Simulating User Events
There are numerous ways a user can interact with a webpage. Even though live user feedback and interaction is irreplaceable, we can still build some confidence in our components through tests. Here’s a button which changes the heading of the App