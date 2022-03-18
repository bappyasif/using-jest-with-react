

// React Testing in the Real World
// We start by importing a bunch of stuff like any other decent React component. There might be a couple of unfamiliar things on there; 
// we don’t have to worry too much about them. If we glance at the props, there are some functions in there, presumably event handlers.
    // If there’s a userSubmission, it renders the Submission component
    // If hasSubmission is true, sort the submissions and render them with Submission. Otherwise, a heading that says “No Submissions yet, be the first!”
    // If allSubmissionsPath is true, it renders a <p> tag.

// We notice there are two child components of SubmissionsList. One of them is from a package called react-flip-move. External Code. We’ll mock it.

// Notice how we mock the Submission component:
jest.mock('../submission', () => ({ submission, isDashboardView }) => (
    <>
      <div data-test-id="submission">{submission.id}</div>
      <div data-test-id="dashboard">{isDashboardView.toString()}</div>
    </>
));
// We only render the bare minimum to realize the validity of the component we’re testing. Next, we set up our props with fake data and mocked functions
// In the first suite, we make some assertions if the user has a submission and then some assertions if the user does not. The other suites follow a similar pattern.