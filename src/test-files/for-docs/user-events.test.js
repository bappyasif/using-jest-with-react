import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// API
// Note: All userEvent methods are synchronous with one exception: when delay option used with userEvent.type

// click(element, eventInit, options)
// Clicks element, depending on what element is clicked, calling click() can have different side effects.

test('click', () => {
    render(
        <div>
            <label htmlFor="checkbox">Check</label>
            <input id="checkbox" type="checkbox" />
        </div>,
    )

    userEvent.click(screen.getByText('Check'))
    expect(screen.getByLabelText('Check')).toBeChecked()

    // You can also ctrlClick / shiftClick etc with
    // userEvent.click(elem, { ctrlKey: true, shiftKey: true })

    // Note that click will trigger hover events before clicking. To disable this, set the skipHover option to true.

    // Pointer events options
    // Trying to click an element with pointer-events being set to "none" (i.e. unclickable) will throw an error. 
    // to disable this behavior you can set skipPointerEventsCheck to true
    // userEvent.click(elem, undefined, { skipPointerEventsCheck: true })
    
    // The skipPointerEventsCheck option can be passed to any pointer related API including:
        // dblClick
        // hover
        // unhover
        // selectOptions
        // deselectOptions
})