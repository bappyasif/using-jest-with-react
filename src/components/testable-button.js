import React, { useState } from 'react'

function TestableButton() {
    let [headingText, setHeadingText] = useState('Magnificent Monkeys')
    let clickHandler = () => setHeadingText('Radical Rhinos')
  return (
    <div id='btn-container'>
        TestableButton
        <button type="button" onClick={clickHandler}>
        Click Me
      </button>
      <h1>{headingText}</h1>
    </div>
  )
}

export default TestableButton