import React from 'react'
import User from './User'

// User context, used to make current user accessible from anywhere.
// null should be used if the user is not logged in
const UserContext = React.createContext<User | null>(null)

export default UserContext
