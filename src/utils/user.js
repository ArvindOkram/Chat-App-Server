const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user)=>
        user.room === room
    )    
}

addUser({
    id: 26,
    username: 'Arvind  ',
    room: '  Bangalore'
})

addUser({
    id: 25,
    username: 'Rohit  ',
    room: '  Pune'
})

addUser({
    id: 27,
    username: 'Pinder  ',
    room: '  Imphal'
})

const user = getUser(25)
console.log(user)

const user_list = getUsersInRoom('imphal')
console.log(user_list)

console.log(users)
//const removedUser = removeUser(22)

//console.log(removedUser)
//console.log(users)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}