import React from 'react'
import { render, screen, getByRole } from '@testing-library/react'
import userEvent, {specialChars} from '@testing-library/user-event'
import Tooltip from '../../components/from-docs/tooltips'

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

// dblClick(element, eventInit, options): Clicks element twice, depending on what element is it can have different side effects:
test('double click', () => {
    let handleChange = jest.fn()
    render(<input type={'checkbox'} onChange={handleChange} />)
    let checkbox = screen.getByRole('checkbox')
    userEvent.dblClick(checkbox)
    expect(handleChange).toHaveBeenCalledTimes(2)
    expect(checkbox).not.toBeChecked()
})

// type(element, text, [options]): Writes text inside an <input> or a <textarea>:
test('type', () => {
    render(<textarea />)
    userEvent.type(screen.getByRole('textbox'), 'Hello, {enter}World!')
    expect(screen.getByRole('textbox')).toHaveValue('Hello, \nWorld!')
})
// options.delay is the number of milliseconds that pass between two characters are typed
// By default it's 0. You can use this option if your component has a different behavior for fast or slow users. 
// If you do this, you need to make sure to await!
// type will click the element before typing. To disable this, set the skipClick option to true

// Special characters
// {enter} => only for teaxt area
// {space}, {backspace}, {del}
// {selectall} => Selects all the text of the element. Note that this will only work for elements that support selection ranges (so, not email, password, number, among others)
// {arrowleft}, {arrowright}, {arrowup}, {arrowdown}, {home}, {end}, {shift}, {crtl}, {alt}, {meta}
// {capslock} => Fires both keydown and keyup when used (simulates a user clicking their "Caps Lock" button to enable caps lock)

// A note about modifiers: 
// Modifier keys ({shift}, {ctrl}, {alt}, {meta}) will activate their corresponding event modifiers for the duration of type command 
// or until they are closed (via {/shift}, {/ctrl}, etc.). If they are not closed explicitly, then events will be fired to close them automatically (to disable this, set the skipAutoClose option to true)

// An example of an usage with a selection range:
test('delete characters within range', () => {
    render(
        <div>
            <label htmlFor='my-input'>Example:</label>
            {/* <input id='my-input' type={'text'} value={'This is a bad example'} /> */}
            <input id="my-input" type="text" value="This is a bad example" />
        </div>
    )

    let input = screen.getByLabelText(/Example/i)
    // input.setSelectionRange(10, 13)
    // userEvent.type(input, '{backspace}good')
    input.setSelectionRange(10, 13)
    userEvent.type(input, '{backspace}good')
    // expect(input).toHaveValue('This is a good example')
})

// test('delete characters within the selectedRange', () => {
//     render(
//       <div>
//         <label htmlFor="my-input">Example:</label>
//         <input id="my-input" type="text" value="This is a bad example" />
//       </div>,
//     )
//     const input = screen.getByLabelText(/example/i)
//     input.setSelectionRange(10, 13)
//     userEvent.type(input, '{backspace}good')

//     expect(input).toHaveValue('This is a good example')
// })

// By default, type appends to the existing text. To prepend text, reset the element's selection range 
// and provide the initialSelectionStart and initialSelectionEnd options
test('prepend text', () => {
    render(<input defaultValue={'World!'} />)
    let elem = screen.getByRole('textbox')

    // prepend text
    elem.setSelectionRange(0, 0)
    userEvent.type(elem, 'Hello, ', {
        initialSelectionStart: 0,
        initialSelectionEnd: 0
    })

    expect(elem).toHaveValue('Hello, World!')
})

// <input type="time" /> support
test('type time into input', () => {
    render(
        <div>
            <label htmlFor='time'>Enter time</label>
            <input id='time' type={'time'} />
        </div>
    )

    let elem = screen.getByLabelText(/enter time/i)
    userEvent.type(elem, '13:58')
    expect(elem.value).toBe('13:58')
})

// keyboard(text, options): Simulates the keyboard events described by text: 
// This is similar to userEvent.type() but without any clicking or changing the selection range
// You should use userEvent.keyboard if you want to just simulate pressing buttons on the keyboard
// You should use userEvent.type if you just want to conveniently insert some text into an input field or textarea
// Keystrokes can be described:
// Per printable character: userEvent.keyboard('foo') // translates to: f, o, o
// The brackets { and [ are used as special character and can be referenced by doubling them: userEvent.keyboard('{{a[[') // translates to: {, a, [
// Per KeyboardEvent.key (only supports alphanumeric values of key): userEvent.keyboard('{Shift}{f}{o}{o}') // translates to: Shift, f, o, o : This does not keep any key pressed. So Shift will be lifted before pressing f
// Per KeyboardEvent.code: userEvent.keyboard('[ShiftLeft][KeyF][KeyO][KeyO]') // translates to: Shift, f, o, o
// Per legacy userEvent.type modifier/specialChar The modifiers like {shift}: note the lowercase) will automatically be kept pressed, just like before: You can cancel this behavior by adding a / to the end of the descriptor: userEvent.keyboard('{shift}{ctrl/}a{/shift}') // translates to: Shift(down), Control(down+up), a, Shift(up)
// Keys can be kept pressed by adding a > to the end of the descriptor - and lifted by adding a / to the beginning of the descriptor: userEvent.keyboard('{Shift>}A{/Shift}') // translates to: Shift(down), A, Shift(up)
// userEvent.keyboard returns a keyboard state that can be used to continue keyboard operations: 
// const keyboardState = userEvent.keyboard('[ControlLeft>]') // keydown [ControlLeft]
// ... inspect some changes ...
// userEvent.keyboard('a', {keyboardState}) // press [KeyA] with active ctrlKey modifier
// Automatically pressing {Shift} when CapsLock is not active and A is referenced. 
// If you don't wish this behavior, you can pass autoModify: false when using userEvent.keyboard in your code

// upload(element, file, [{ clickInit, changeInit }], [options]): Uploads file to an <input>: 
// For uploading multiple files use <input> with the multiple attribute and the second upload argument as an array
// It's also possible to initialize a click or change event using a third argument
// If options.applyAccept is set to true and there is an accept attribute on the element, files that don't match will be discarded
test('upload file', () => {
    let file = new File(['hello'], 'hello.png', { type: 'image/png' })

    render(
        <div>
            <label htmlFor='file-uploader'>Upload file:</label>
            <input id='file-uploader' type={'file'} />
        </div>
    )

    let elem = screen.getByLabelText(/upload file/i)
    userEvent.upload(elem, file)

    expect(elem.files[0]).toStrictEqual(file)
    expect(elem.files.item(0)).toStrictEqual(file)
    expect(elem.files).toHaveLength(1)
})

test('upload multiple files', () => {
    let files = [
        new File(['hello'], 'hello.png', { type: 'image/png' }),
        new File(['world'], 'world.png', { type: 'image/png' })
    ]

    render(
        <div>
            <label htmlFor='file-uploader'>Upload file:</label>
            <input id='file-uploader' type={'file'} multiple />
        </div>
    )

    let elem = screen.getByLabelText(/upload file/i)
    userEvent.upload(elem, files)

    expect(elem.files).toHaveLength(2)
    expect(elem.files[0]).toStrictEqual(files[0])
    expect(elem.files[1]).toStrictEqual(files[1])
})

// clear(element): Selects the text inside an <input> or <textarea> and deletes it:
test('clear content', () => {
    render(<textarea defaultValue={'Hello World!'} />)

    userEvent.clear(screen.getByRole('textbox'))
    expect(screen.getByRole('textbox')).toHaveValue('')
})

// selectOptions(element, values, options): Selects the specified option(s) of a <select> or a <select multiple> element:
test('select options', () => {
    render(
        <select multiple>
            <option value={'a'}>A</option>
            <option value={'b'}>B</option>
            <option value={'c'}>C</option>
            <option value={'d'}>D</option>
        </select>
    )

    userEvent.selectOptions(screen.getByRole('listbox'), ['a', 'd'])

    expect(screen.getByRole('option', { name: 'A' }).selected).toBe(true)
    expect(screen.getByRole('option', { name: 'B' }).selected).toBe(false)
    expect(screen.getByRole('option', { name: 'C' }).selected).toBe(false)
    expect(screen.getByRole('option', { name: 'D' }).selected).toBe(true)

    // The values parameter can be either an array of values or a singular scalar value
    // It also accepts option nodes:
    // userEvent.selectOptions(screen.getByTestId('select-multiple'), [
    //     screen.getByText('A'),
    //     screen.getByText('B'),
    // ])
})

// deselectOptions(element, values, options): Remove the selection for the specified option(s) of a <select multiple> element:
test('disselect options', () => {
    render(
        <select multiple>
            <option value="1">A</option>
            <option value="2">B</option>
            <option value="3">C</option>
            <option value="4">D</option>
        </select>,
    )

    userEvent.selectOptions(screen.getByRole('listbox'), '2')
    expect(screen.getByText('B').selected).toBe(true)

    userEvent.deselectOptions(screen.getByRole('listbox'), '2')
    expect(screen.getByText('B').selected).toBe(false)

    // can do multiple at once as well:
    userEvent.deselectOptions(screen.getByRole('listbox'), ['1', '2'])
    expect(screen.getByText('B').selected).toBe(false)
})

// tab({shift, focusTrap}): Fires a tab event changing the document.activeElement in the same way the browser does
// options:
// shift (default false) can be true or false to invert tab direction
// focusTrap (default document) a container element to restrict the tabbing within
// A note about tab:
// jsdom does not support tabbing, so this feature is a way to enable tests to verify tabbing from the end user's perspective
// However, this limitation in jsdom will mean that components like focus-trap-react will not work with userEvent.tab() or jsdom
// For that reason, the focusTrap option is available to let you ensure your user is restricted within a focus-trap
test('should cycle elements in document tab order', () => {
    render(
        <div>
            <input data-testid="element" type="checkbox" />
            <input data-testid="element" type="radio" />
            <input data-testid="element" type="number" />
            <input data-testid="element" type="text" />
        </div>,
    )

    let [checkbox, radio, number, text] = screen.getAllByTestId('element')

    expect(document.body).toHaveFocus()

    userEvent.tab();
    expect(checkbox).toHaveFocus()

    userEvent.tab();
    expect(radio).toHaveFocus()

    userEvent.tab();
    expect(number).toHaveFocus()

    userEvent.tab();
    expect(text).toHaveFocus()
})

// hover(element, options):
test('hover', () => {
    let msgText = 'Hello'

    render(
        <div>
            <Tooltip messageText={msgText}>
                <div>delete</div>
            </Tooltip>
        </div>
    )

    userEvent.hover(screen.getByText(/Delete/i))
    expect(screen.getByText(msgText)).toBeInTheDocument()

    userEvent.unhover(screen.getByText(/Delete/i))
    expect(screen.queryByText(msgText)).not.toBeInTheDocument()
})

// paste(element, text, eventInit, options): Allows you to simulate the user pasting some text into an input:
test('paste text in input', () => {
    render(
        <div>
            <label htmlFor='user-input'>Paste your greeting:</label>
            <input id='user-input' />
        </div>
    )

    let text = 'Hello, world!'
    let elem = screen.getByRole('textbox', { name: /paste your greeting/i })
    userEvent.paste(elem, text)
    expect(elem).toHaveValue(text)
})
// we can use the eventInit if what we're pasting should have clipboardData (like files)

// test('delete characters within the selectedRange', () => {
//     render(
//         <div>
//             <label htmlFor="my-input">Example:</label>
//             <input id="my-input" type="text" value="This is a bad example" />
//         </div>,
//     )
//     const input = screen.getByLabelText(/example/i)
//     input.setSelectionRange(10, 13)
//     userEvent.type(input, `${specialChars.backspace}good`)

//     expect(input).toHaveValue('This is a good example')
// })