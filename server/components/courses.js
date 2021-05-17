const { query } = require('./sqlquery');

const getCourses = async (university) => {
    var courses = [];
    const r = await query('select * from course natural join university where allias = ?', university);
    for (var i = 0; i < r.length; i++) {
        courses.push(r[i].course);
    }
    console.log(courses);
    return courses;
}

const getCourse = async (university, course) => {
    const r = await query('select course, University_Name, department, term, instructor from course natural join university where allias = ? and course = ?', [university, course]);
    if (r.length == 0) {
        return {};
    }
    return r[0];
}

const updateCourse = async (university, course, attribute, value) => {
    const r  = await query(`
    update Course set ${attribute} = ?
    where course = ? and University_Name = ( select University_Name from University where allias = ? );
    `, [value, course, university]);
}

const addCourse = async (university, newCourse) => {
    const r = await query('select * from University where allias = ?', university);
    await query('insert into Course(University_Name, course) values(?, ?);', [r[0].University_Name, newCourse]);
}

const deleteCourse = async (university, deleteCourses) => {
    const r = await query('select * from University where allias = ?', university);
    for (var i = 0; i < deleteCourses.length; i++) {
        await query('delete from course where University_Name = ? and course = ?', [r[0].University_Name, deleteCourses[i]]);
    }
}


module.exports = { getCourses, addCourse, deleteCourse, getCourse, updateCourse };