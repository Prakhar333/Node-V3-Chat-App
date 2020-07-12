const { get } = require("http")

const users = []

// addUser, removeUser, getUser, getUserInRoom

const addUser = ({ id, username, room}) =>
{
    // Clean Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate Data
    if(!username || !room)
    {
        return{
            error:'Username and Room are required!'
        }
    }

    // Check for existing User
    const existingUser = users.find((user)=>
    {
        return user.room === room && user.username === username
    })

    // Validating user
    if(existingUser){
        return{
            error: 'Username in use!'
        }
    }

    // Store User
    const user = { id, username, room}
    users.push(user)
    return { user }
}

// Removing User
const removeUser = (id)=>
{
    const index = users.findIndex((user)=> user.id === id)

    if(index !== -1)
    {
        return users.splice(index, 1)[0]
    }
}

// getUser
const getUser = (id)=>
{
    return users.find((user) => user.id === id)
}

// Get users in room
const getUserInRoom = (room) =>
{
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}