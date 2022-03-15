import logo from './logo.svg';
import './App.css';
import TestableComponent from './components/testable-comp';
import SampleForm from './components/from-docs/sample-form';
import TestableButton from './components/testable-button';

function App() {
  return (
    <div className="App">
      {/* <h1>Our First Test</h1> */}
      <header className="App-header">
        Testing with Jest using React environment
      </header>
      <TestableComponent />
      <SampleForm />
      <TestableButton />
    </div>
  );
}

export default App;
