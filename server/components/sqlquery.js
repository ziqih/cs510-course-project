const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cs510',
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected correctly to SQL');
});

const query = util.promisify(con.query).bind(con);
const readFile = util.promisify(fs.readFile);

function getUniversieties() {
  return readFile('US_Universities.txt', 'utf-8');
}

const init = async () => {
  var universities;
  await getUniversieties().then(data => {
    universities = data.split('\n');
  });
  await query('DROP TABLE IF EXISTS University;');
  await query('create table University (University_Name VARCHAR(255) NOT NULL,allias VARCHAR(255),PRIMARY KEY (University_Name));');
  await query('DROP TABLE IF EXISTS Course;');
  await query('create table Course (University_Name VARCHAR(255),course VARCHAR(255),department VARCHAR(255),term VARCHAR(255),instructor VARCHAR(255), PRIMARY KEY (course, University_Name));');
  
  // parse universities from US_Universities.txt 
  var name_set = new Object();
  for (var i = 0; i < universities.length - 1; i++) {
    var name = universities[i].replace('-', ' ');
    name = name.replace('-', ' ');
    name = name.replace('-', ' ');
    var name_split = name.split(' ');
    var allias = '';
    for (var j = 0; j < name_split.length; j++) {
      if (name_split[j] !== 'at' && name_split[j] !== 'of' && name_split[j] !== '') {
        allias += name_split[j][0];
      }
    }
    if (allias in name_set) {
      name_set[allias]++;
      allias += String(name_set[allias]);
    } else {
      name_set[allias] = 0;
    }
    await query('insert into University(University_Name, allias) values(?, ?);', [universities[i], allias]);
  }

  // await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS411", "CS", "Fall 2020", "Abudu");');
  // await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS418", "CS", "Fall 2020", "Abudu");');
  // await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS425", "CS", "Fall 2020", "Abudu");');
  // await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH100", "MATH", "Fall 2020", "Professor A");');
  // await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH200", "MATH", "Fall 2020", "Professor B");');
  // await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS225", "PHYS", "Fall 2020", "Professor X");');
  // await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS400", "PHYS", "Fall 2020", "Professor Y");');

await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS 411", "CS", "Fall 2020", "Abudu");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS 418", "CS", "Fall 2020", "Professor 1");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS 225", "CS", "Fall 2020", "Professor 5");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS 410", "CS", "Fall 2020", "Professor 7");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS 125", "CS", "Fall 2020", "Professor 3");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS 510", "CS", "Fall 2020", "Professor 1");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS 425", "CS", "Fall 2020", "Professor 2");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS 499", "CS", "Fall 2020", "Professor 5");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS 450", "CS", "Fall 2020", "Professor 5");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS 173", "CS", "Fall 2020", "Professor 5");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "MATH 322", "MATH", "Fall 2020", "Professor 16");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "MATH 204", "MATH", "Fall 2020", "Professor 17");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "MATH 250", "MATH", "Fall 2020", "Professor 16");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "MATH 542", "MATH", "Fall 2020", "Professor 15");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "MATH 144", "MATH", "Fall 2020", "Professor 11");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "MATH 419", "MATH", "Fall 2020", "Professor 14");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "MATH 258", "MATH", "Fall 2020", "Professor 15");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "MATH 493", "MATH", "Fall 2020", "Professor 11");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "MATH 320", "MATH", "Fall 2020", "Professor 17");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "MATH 148", "MATH", "Fall 2020", "Professor 14");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "PHYS 320", "PHYS", "Fall 2020", "Professor 20");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "PHYS 214", "PHYS", "Fall 2020", "Professor 27");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "PHYS 329", "PHYS", "Fall 2020", "Professor 20");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "PHYS 261", "PHYS", "Fall 2020", "Professor 23");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "PHYS 565", "PHYS", "Fall 2020", "Professor 20");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "PHYS 517", "PHYS", "Fall 2020", "Professor 26");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "PHYS 206", "PHYS", "Fall 2020", "Professor 23");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "PHYS 336", "PHYS", "Fall 2020", "Professor 26");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "PHYS 542", "PHYS", "Fall 2020", "Professor 23");');
await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "PHYS 187", "PHYS", "Fall 2020", "Professor 20");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "CS 288", "CS", "Fall 2020", "Professor 6");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "CS 129", "CS", "Fall 2020", "Professor 1");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "CS 474", "CS", "Fall 2020", "Professor 6");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "CS 359", "CS", "Fall 2020", "Professor 7");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "CS 439", "CS", "Fall 2020", "Professor 4");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "CS 540", "CS", "Fall 2020", "Professor 1");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "CS 248", "CS", "Fall 2020", "Professor 3");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "CS 116", "CS", "Fall 2020", "Professor 0");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "CS 135", "CS", "Fall 2020", "Professor 0");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "CS 587", "CS", "Fall 2020", "Professor 0");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH 583", "MATH", "Fall 2020", "Professor 10");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH 457", "MATH", "Fall 2020", "Professor 17");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH 259", "MATH", "Fall 2020", "Professor 17");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH 189", "MATH", "Fall 2020", "Professor 12");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH 401", "MATH", "Fall 2020", "Professor 14");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH 571", "MATH", "Fall 2020", "Professor 13");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH 302", "MATH", "Fall 2020", "Professor 12");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH 288", "MATH", "Fall 2020", "Professor 12");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH 531", "MATH", "Fall 2020", "Professor 17");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "MATH 447", "MATH", "Fall 2020", "Professor 13");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "PHYS 397", "PHYS", "Fall 2020", "Professor 22");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "PHYS 593", "PHYS", "Fall 2020", "Professor 27");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "PHYS 491", "PHYS", "Fall 2020", "Professor 26");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "PHYS 518", "PHYS", "Fall 2020", "Professor 27");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "PHYS 425", "PHYS", "Fall 2020", "Professor 23");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "PHYS 596", "PHYS", "Fall 2020", "Professor 27");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "PHYS 366", "PHYS", "Fall 2020", "Professor 21");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "PHYS 411", "PHYS", "Fall 2020", "Professor 20");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "PHYS 578", "PHYS", "Fall 2020", "Professor 27");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Princeton University", "PHYS 359", "PHYS", "Fall 2020", "Professor 23");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "CS 471", "CS", "Fall 2020", "Professor 5");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "CS 218", "CS", "Fall 2020", "Professor 5");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "CS 113", "CS", "Fall 2020", "Professor 0");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "CS 171", "CS", "Fall 2020", "Professor 4");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "CS 253", "CS", "Fall 2020", "Professor 2");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "CS 237", "CS", "Fall 2020", "Professor 6");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "CS 224", "CS", "Fall 2020", "Professor 1");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "CS 157", "CS", "Fall 2020", "Professor 5");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "CS 165", "CS", "Fall 2020", "Professor 2");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "CS 133", "CS", "Fall 2020", "Professor 5");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "MATH 338", "MATH", "Fall 2020", "Professor 16");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "MATH 350", "MATH", "Fall 2020", "Professor 12");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "MATH 405", "MATH", "Fall 2020", "Professor 16");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "MATH 364", "MATH", "Fall 2020", "Professor 14");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "MATH 391", "MATH", "Fall 2020", "Professor 16");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "MATH 576", "MATH", "Fall 2020", "Professor 12");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "MATH 483", "MATH", "Fall 2020", "Professor 17");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "MATH 343", "MATH", "Fall 2020", "Professor 15");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "MATH 372", "MATH", "Fall 2020", "Professor 11");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "MATH 109", "MATH", "Fall 2020", "Professor 16");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS 423", "PHYS", "Fall 2020", "Professor 26");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS 204", "PHYS", "Fall 2020", "Professor 21");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS 323", "PHYS", "Fall 2020", "Professor 23");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS 196", "PHYS", "Fall 2020", "Professor 26");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS 352", "PHYS", "Fall 2020", "Professor 22");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS 211", "PHYS", "Fall 2020", "Professor 26");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS 562", "PHYS", "Fall 2020", "Professor 22");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS 470", "PHYS", "Fall 2020", "Professor 24");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS 133", "PHYS", "Fall 2020", "Professor 24");');
await query('insert into Course(University_Name, course, department, term, instructor) values("Massachusetts Institute of Technology", "PHYS 278", "PHYS", "Fall 2020", "Professor 21");');

  client = new MongoClient('mongodb://localhost:27017/411');
  client.connect(async () => {
      const db = client.db('cs411');
      db.collection('users').createIndex( { name: 1 }, { unique: true } );
      try {
        await db.collection('users').remove({});
        await db.collection('users').insertOne({"name":"student1","email":"1@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student2","email":"2@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student3","email":"3@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student4","email":"4@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student5","email":"5@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student6","email":"6@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student7","email":"7@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student8","email":"8@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student9","email":"9@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student10","email":"10@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student11","email":"11@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
        await db.collection('users').insertOne({"name":"student12","email":"12@gmail.com","likes":[["UIUC","CS 411"], ["UIUC", "CS 425"], ["UIUC", "CS 418"]]});
      } catch (e) {
        console.log('???');
      }
  });
}

module.exports = {
    query: util.promisify(con.query).bind(con),
    init
};
