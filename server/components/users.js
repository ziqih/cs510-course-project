/**
 * Manage users' sign-in, sign-out
*/
const { MongoClient } = require('mongodb');

const users = [];
const url = 'mongodb://localhost:27017/411'

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room == room && user.name == name);
    if (existingUser) {
        return { error: "Username is taken" }
    }

    const user = { id, name, room };
    users.push(user);

    client = new MongoClient(url);
    client.connect(async () => {
        const db = client.db('cs411');
        try {
            await db.collection('users').insertOne({"name":name,"email":`${name}@email.com`,"likes":[]});
        } catch (e) {
            console.log('Failed to insert user');
        }
    });

    return { user };
} 

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id == id);
    if (index != -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    // get user in chat room
    return users.find((user) => user.id == id);
}

async function dbQueryUser(name) {
    // https://stackoverflow.com/questions/49048484/wait-until-mongodb-has-completed-its-query-without-using-callbacks
    const db = await MongoClient.connect(url);
    const dbo = db.db("cs411");
    const user = await dbo.collection("users").findOne({name: name})
    return user
}

const getUserFromDB = async (name) => {
    var user;
    try {
        user = await dbQueryUser(name)
    } catch (error) {
        console.log(error);
    }
    return user;
}

const likeCourse = async (name, course, university) => {
    const courseInfo = `${university}-${course}`
      client = new MongoClient(url);
      client.connect(async () => {
          const db = client.db('cs411');
          try {
              await db.collection('users').updateOne(
                { "name": name }, // query matching , refId should be "ObjectId" type
                { $addToSet: { "likes":  courseInfo} } //single object will be pushed to attachemnts
               )
          } catch (e) {
              console.log('Failed to like course');
          }
      });
}

const unlikeCourse = async (name, course, university) => {    
    const courseInfo = `${university}-${course}`
    client = new MongoClient(url);
    client.connect(async () => {
        const db = client.db('cs411');
        try {
            await db.collection('users').updateOne(
              { "name": name }, // query matching , refId should be "ObjectId" type
              { $pull: { likes: courseInfo } }
             )
        } catch (e) {
            console.log('Failed to unlike course');
        }
    });
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room == room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getUserFromDB, likeCourse, unlikeCourse };