import React from 'react'

function UsersList({ users }) {
    return (
        <div>
            UsersList
            <ul>
                {users.map(user => <UsersListRow user={user} key={user.id} />)}
            </ul>
        </div>
    )
}

let UsersListRow = ({ user }) => {
    return (
        <li key={user.id}>
            <div>
                <strong>user name</strong>
                {`${user.firstName} ${user.lastName}`}
            </div>
            <div>
                <strong>email</strong>
                {user.email}
            </div>
        </li>
    )
}

// causes in lengthy snapshot
// function UsersList({ users }) {
//     return (
//         <div>
//             UsersList
//             <ul>
//                 {users.map(user => (
//                     <li key={user.id}>
//                         <div>
//                             <strong>user name</strong>
//                             {`${user.firstName} ${user.lastName}`}
//                         </div>
//                         <div>
//                             <strong>email</strong>
//                             {user.email}
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     )
// }

export default UsersList