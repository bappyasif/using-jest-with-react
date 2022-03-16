import React, { useState } from 'react'

function Tooltip({ messageText, children }) {
    let [hovered, setHovered] = useState(false)
    return (
        <div >
            {/* {messageText} */}
            { hovered ? messageText : 'not prop message text!!'}
            <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>{children}</div>
        </div>
    )
}

export default Tooltip