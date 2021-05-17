const { query } = require('./sqlquery');
const { execFile } = require('child_process');
const fs = require('fs');
const util = require('util');
const fsPromises = require('fs').promises;
const { parse } = require('path');


var questions = []


const addQuestion = async (title, description) => {
    console.log("add question", title);
    const qa = await readQuestionsFile();
    qa.push({"id": qa.length, "title": title, "description": description, "answers":[]})
    const s = JSON.stringify(qa, null, 4)
    awaitfs.writeFile('components/data.json', s, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

const readQuestionsFile = async () => {
    const data = await fsPromises.readFile('components/data.json').catch((err) => console.error('Failed to read file', err));
    const qa = JSON.parse(data.toString())
    return parseAnswers(qa);
}

const writeQuestionsFile = async (questions) => {
    const s = JSON.stringify(questions, null, 4)
    fs.writeFile('components/data.json', s, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

const addAnswer = async (qid, answer, user="anonymous") => {
    const qa = await readQuestionsFile();
    if (user.length == 0) {
        user = "anonymous";
    }
    qa[qid]['answers'].push({"user": user, "answer": answer, "endorse": 0})
    const s = JSON.stringify(qa, null, 4)
    fs.writeFile('components/data.json', s, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

const sortedAnswerByEndorse = (answers) => {
    answers.sort(function(a, b) {
        var keyA = a["endorse"],
          keyB = b["endorse"];
        // Compare the 2 answers
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
    return answers;
      
}

const endorseAnswer = async (questionId, answerId) => {
    const qa = await readQuestionsFile();
    if (questionId >= 0 && questionId < qa.length) {
        var answers = qa[questionId]["answers"];
        if (answerId >= 0 && answerId < answers.length) {
            qa[questionId]["answers"][answerId]["endorse"] += 1;
            qa[questionId]["answers"] = sortedAnswerByEndorse(qa[questionId]["answers"]);
            await writeQuestionsFile(qa);
            return qa[questionId]["answers"][answerId]["endorse"];
        }
    }
    return 0;
}

// addQuestion("what is nature?",  "..." );
// addQuestion("watch movies?", "..." );
// addAnswer(0, "i think...");
// addAnswer(1, "??");

function parseAnswers(doc) {
    for (var i = 0; i < doc.length; i++) {
        var answers = doc[i]["answers"];
        var newAnswers = [];
        for (var j = 0; j < answers.length; j++) {
            if (typeof answers[j] === "string") {
                newAnswers.push({"user":"admin", "answer": answers[j], "endorse":0});
            } else {
                newAnswers.push(answers[j]);
            }
        }
        doc[i]["answers"] = newAnswers;
    }
    return doc;
}

async function getQuestions() {
    const qa = await readQuestionsFile();
    return qa;
} 

async function searchQuestion(query) {
    var args = ['components/BM25.py']
    const q = query.split()
    for (var i = 0; i < q.length; i++) {
        args.push(q[i])
    }
    const result = await new Promise((resolve) => {
        try {
            execFile('python', args, { maxBuffer: 1024 * 10240 }, (error, stdout) => {
                if (error) {
                // throw error;
                    console.log('failed to run');
                    console.log(error);
                } else {
                    resolve(stdout);
                }
            });
        } catch (error) {
            resolve(error);
        }
    });
    const qa = await readQuestionsFile();
    return qa;
}

const getQuestion = async (id) => {
    const qa = await readQuestionsFile();
    console.log(id)
    var ret = parseAnswers([qa[id]])[0];
    return ret;
}

module.exports = { getQuestions, addQuestion, searchQuestion, getQuestion, addAnswer, endorseAnswer };