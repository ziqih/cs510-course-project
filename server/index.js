const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const { addUser, removeUser, getUser, getUsersInRoom, getUserFromDB, likeCourse, unlikeCourse } = require('./components/users.js');
const { getCourses, addCourse, deleteCourse, getCourse, updateCourse } = require('./components/courses.js');
const { getUniversities } = require('./components/universities.js');
const { getQuestions, addQuestion, searchQuestion, getQuestion, addAnswer, endorseAnswer } = require('./components/questions.js');
// const { init, query } = require('./components/sqlquery.js');
const { execFile } = require('child_process');

// const { MongoClient } = require('mongodb');

const PORT = process.env.PORT || 5000
const router = require('./components/router');
const e = require('express');
const { constants } = require('buffer');
const app = express();

// client = new MongoClient('mongodb://localhost:27017/listenonline');
// client.connect(async () => {
//     const db = client.db('listenonline');

//     try {
//         const counter = await db.collection('counters').findOne({ _id: 'server_id' });
//         console.log(counter, 3113)
//         if (!counter) {
//         db.collection('counters').insertOne({ _id: 'server_id', sequence_value: 0 });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// });

const server = http.createServer(app);
const io = socketio(server);


io.on('connection', (socket) => {
    console.log('We have a new connection!!!');
    
    // Handle user join message
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room});
        if (error) {
            return callback(error);
        }
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`});

        socket.join(user.room);
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

        callback(); // no errors
    });

    // Handle Home join message
    socket.on('homeJoin', ({ message }, callback) => {
        console.log(message);
        callback();
    });

    // Handle Home get courses
    socket.on('getCourses', async ({ university }, callback) => {
        // console.log("Received getCourses", university);
        // const courses = await getCourses(university);
        // client = new MongoClient('mongodb://localhost:27017/510');
        // client.connect(async () => {
        // const db = client.db('cs510');

        // try {
        //     const counter = await db.collection('counters').findOne({ _id: 'server_id' });
        //     console.log(counter, 183113)
        //     if (!counter) {
        //     db.collection('counters').insertOne({ _id: 'server_id', sequence_value: 0 });
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
        // });
        // console.log(3113)
        callback({message: "getCourses Sucesss", "courses": ['CS 510']});
    });

    // Handle Home add courses
    socket.on('addCourse', async ({ university, course }, callback) => {
        console.log("Received addCourse", university, course);
        await addCourse(university, course);
        callback({ message: "addCourse Sucesss"});
    });

    // Handle Home delete courses
    socket.on('deleteCourse', async ({ university, courses }, callback) => {
        console.log("Received deleteCourse", university, courses);
        await deleteCourse(university, courses);
        callback({ message: "deleteCourse Sucesss"});
    });

    // Handle Home get universities
    socket.on('getUniversities', async (req, callback) => {
        // var universities = await getUniversities();
        callback({message: "getUniversities Sucesss", "universities": [{ key: 'uiuc', value: 'University of Illinois at Urbana Champaign' }]});
    });

    // Handle Edit get course
    socket.on('getCourse', async ({ message, university, course }, callback) => {
        var courseInfo = await getCourse(university, course);
        console.log('getCourse: ', courseInfo);
        callback({message: "getCourse Success", "course": courseInfo});
    });

    // Handle Edit update course
    socket.on('updateCourse', async ({ message, university, course, attribute, value }, callback) => {
        await updateCourse(university, course, attribute, value);
        console.log("updateCourse", university, course, attribute, value);
        callback({message: "updateCourse Successs"});
    })

    // Handle user sent message
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        callback();
    });

    socket.on('getUser', async (message, callback) => {
        const user = await getUserFromDB(message.name)
        if (user) {
            console.log("Find user! ->", user)
        } else {
            console.log("User %s not found", user)
        }
        callback({message: "getUser Success", user});
    });

    socket.on('likeCourse', async (message, callback) => {
        await likeCourse(message.name, message.course, message.university);
        callback({message: "likeCourse Successs"})
    });

    socket.on('unlikeCourse', async (message, callback) => {
        await unlikeCourse(message.name, message.course, message.university);
        callback({message: "unlikeCourse Success"})
    })

    socket.on('recommend', async (message, callback) => {
        // likes = ["MIT-CS 333"]
        console.log("received RECOMMEND:", message);
        likes = message.likes
        university = 'UIUC'
        department = 'CS'
        if (likes.length > 0) {
            let l = likes[likes.length - 1].split(" ")
            l = l[0].split("-")
            university = l[0]
            department = l[1]
        }
        const tmp = await new Promise((resolve) => {
            try {
              execFile('python3', ['recommend.py', university, department], (error, stdout) => {
                if (error) {
                  console.log('failed to build');
                  console.log(error);
                } else {
                  resolve(stdout);
                }
              });
            } catch (error) {
              resolve(error);
            }
        });
        console.log('start')
        var l = JSON.parse(tmp)
        console.log(l)

        res = []
        for (var i = 0; i < l.length; i ++) {
            if (likes.indexOf(l[i]) === -1) {
                res.push(l[i])
            }
        }

        if (res.length === 0) {
            const fullName = await query('select University_Name from university where allias = ?', [university]);
            console.log(fullName[0].University_Name)
            const possibleCourses = await query('select course from course where university_name = ? and department = ?', [fullName[0].University_Name, department])
            console.log(possibleCourses)
            for (var i = possibleCourses.length - 1; i > -1 ; i--) {
                if (likes.indexOf(possibleCourses[i].course) === -1) {
                    res.push(university + '-' + possibleCourses[i].course)
                }
                if (res.length === 3) {
                    break
                }
            }
        }

        if (res.length === 0) {
            const fullName = await query('select University_Name from university where allias = ?', [university]);
            console.log(fullName[0].University_Name)
            const possibleCourses = await query('select course from course where university_name = ?', [fullName[0].University_Name])
            // console.log(possibleCourses)
            for (var i = 0; i < possibleCourses.length ; i++) {
                if (likes.indexOf(possibleCourses[i].course) === -1) {
                    res.push(university + '-' + possibleCourses[i].course)
                }
                if (res.length === 3) {
                    break
                }
            }
        }

        if (res.length === 0) {
            res = ['UIUC-CS 125', 'UIUC-CS 173', 'UIUC-CS 225']
        }
        callback({courses: res})
    })
    // ------- questions handling start here
    // Handle get questions
    socket.on('getQuestions', async (req, callback) => {
        var questions = await getQuestions();
        callback({message: "getQuestions Sucesss", "questions": questions});
    });

    socket.on('getQuestion', async (message, callback) => {
        var question = await getQuestion(message.id)
        callback({message: "getQuestion Sucesss", "question": question});
    });

    socket.on('searchQuestion', async (message, callback) => {
        var questions = await searchQuestion(message.question);
        callback({message: "searchQuestion Sucesss", "questions": questions});

    });

    socket.on('createQuestion', async (message, callback) => {
        console.log('create question!');
        await addQuestion(message.title, message.description);
        callback({message: "createQuestion Sucesss", "title": message.title});

    });

    socket.on('addAnswer', async (message, callback) => {
        await addAnswer(message.id, message.answer, message.user);
        callback({message: "createAnswer Sucesss"});

    });

    socket.on('endorseAnswer', async (message, callback) => {
        const endorse = await endorseAnswer(message.questionId, message.answerId);
        callback({message: "endorseAnswer Sucesss", endorse: endorse});

    });
    
    // Handle disconnects
    socket.on('disconnect', () => {
        console.log('User had left!!!');
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left`});
        }
    });

    socket.on('connect_error', function(err) {
        console.log("client connect_error: ", err);
    });
    
    socket.on('connect_timeout', function(err) {
        console.log("client connect_timeout: ", err);
    });
});

const init = async () => {
    console.log('init')
}

init().then(() => {
    app.use(router);
    server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
});

