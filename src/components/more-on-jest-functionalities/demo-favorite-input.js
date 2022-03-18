import React from 'react'

function DemoFavoriteInputComponent({onChange: onInputChange, id}) {
    const inputHandler = (event) => onInputChange(event.target.value);

    return (
      <label htmlFor={id}>
        What is your favorite wild animal?
        <input id={id} onChange={inputHandler} />
      </label>
    );
}
// We’re interested in the onChange prop. We have no idea what the function does. We have no idea how the function will affect the application. 
// All we know is it must be called when user types in the input box. Let’s test it

export default DemoFavoriteInputComponent