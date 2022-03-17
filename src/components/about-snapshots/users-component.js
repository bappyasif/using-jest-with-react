import React from 'react'

function UsersComponent({fetchUsersList}) {
    let {id, } = {...fetchUsersList}
  return (
    <div>
        {/* UsersComponent
        {id} */}
        {/* <div id='h1'>aa</div> */}
        <h1>aa</h1>
        <ul>
            <li>bb</li>
        </ul>
        <button>add new user</button>
    </div>
  )
}

export default UsersComponent