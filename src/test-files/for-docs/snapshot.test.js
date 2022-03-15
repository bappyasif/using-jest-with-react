// Snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly.
// A typical snapshot test case renders a UI component, takes a snapshot, then compares it to a reference snapshot file stored alongside the test
// The test will fail if the two snapshots do not match: either the change is unexpected, or the reference snapshot needs to be updated to the new version of the UI component.

// Snapshot Testing with Jest
// A similar approach can be taken when it comes to testing your React components.
//  Instead of rendering the graphical UI, which would require building the entire app, you can use a test renderer to quickly generate a serializable value for your React tree.
import { fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import SampleLink from '../../components/from-docs/sample-link';

it('renders correctly', () => {
    const tree = renderer
        .create(<SampleLink page="http://www.facebook.com">Facebook</SampleLink>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

// The snapshot artifact should be committed alongside code changes, and reviewed as part of your code review process.
// On subsequent test runs, Jest will compare the rendered output with the previous snapshot.
// If they match, the test will pass. If they don't match, either the test runner found a bug in your code (in the <SampleLink> component in this case) that should be fixed, or the implementation has changed and the snapshot needs to be updated.
// rendering the same component with different props in other snapshot tests will not affect the first one, as the tests don't know about each other.

// Updating Snapshots
// It's straightforward to spot when a snapshot test fails after a bug has been introduced. When that happens, go ahead and fix the issue and make sure your snapshot tests are passing again.

// Updated test case with a Link to a different address
it('renders correctly', () => {
    const tree = renderer
        .create(<SampleLink page="http://www.instagram.com">Instagram</SampleLink>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

// Inline Snapshots
// Inline snapshots behave identically to external snapshots (.snap files), except the snapshot values are written automatically back into the source code. 
// This means you can get the benefits of automatically generated snapshots without having to switch to an external file to make sure the correct value was written.
it('renders correctly', () => {
    const tree = renderer
        .create(<SampleLink page="https://example.com">Example Site</SampleLink>)
        .toJSON();
    // expect(tree).toMatchInlineSnapshot();
});

// Property Matchers
// Often there are fields in the object you want to snapshot which are generated (like IDs and Dates).
//  If you try to snapshot these objects, they will force the snapshot to fail on every run
it('will fail every time', () => {
    const user = {
      createdAt: new Date(),
      id: Math.floor(Math.random() * 20),
      name: 'LeBron James',
    };
  
    expect(user).toMatchSnapshot();
  });
// For these cases, Jest allows providing an asymmetric matcher for any property.
// These matchers are checked before the snapshot is written or tested, and then saved to the snapshot file instead of the received value
it('will check the matchers and pass', () => {
    const user = {
      createdAt: new Date(),
      id: Math.floor(Math.random() * 20),
      name: 'LeBron James',
    };
  
    expect(user).toMatchSnapshot({
      createdAt: expect.any(Date),
      id: expect.any(Number),
    });
  });

// Any given value that is not a matcher will be checked exactly and saved to the snapshot:
it('will check the values and pass', () => {
    const user = {
      createdAt: new Date(),
      name: 'Bond... James Bond',
    };
  
    expect(user).toMatchSnapshot({
      createdAt: expect.any(Date),
      name: 'Bond... James Bond',
    });
  });

// Best Practices
// Snapshots are a fantastic tool for identifying unexpected interface changes within your application – whether that interface is an API response, UI, logs, or error messages. 
    // Treat snapshots as code
        // The goal is to make it easy to review snapshots in pull requests, and fight against the habit of regenerating snapshots when test suites fail instead of examining the root causes of their failure
    // Tests should be deterministic
        // You're responsible for making sure your generated snapshots do not include platform specific or other non-deterministic data.
    // Use descriptive snapshot names
        // Always strive to use descriptive test and/or snapshot names for snapshots. The best names describe the expected snapshot content

// Snapshot tests may cause false positives.
// Snapshot tests may cause false positives. Since we cannot ascertain the validity of the component from a snapshot test, a bug might go undetected.
// The other issue with snapshots is false negatives. 
// Even the most insignificant of changes compel the test to fail. 
// But it’s beneficial to understand when to snapshot, and when not to snapshot.

// test('loads items eventually', async () => {
//     // Click button
//     fireEvent.click(screen.getByText(node, 'Load'))
  
//     // Wait for page to update with query text
//     const items = await findByText(node, /Item #[0-9]: /)
//     expect(items).toHaveLength(10)
//   })

{/* <div data-testid="custom-element" /> */}
// render(<MyComponent />)
// const element = screen.getByTestId('custom-element')