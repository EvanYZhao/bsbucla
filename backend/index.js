const express = require('express');
const app = express();
const mongoose = require('mongoose');
const CourseModel = require('./models/Courses');
const fs = require('fs');

const cors = require('cors');

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://root:Monkey99@cluster0.lm55sto.mongodb.net/project?retryWrites=true&w=majority');

// app.get('/getCourses', (req, res) => {
//     CourseModel.find({}, (err, result) => {
//         if (err) {
//             res.json(err);
//         }
//         else {
//             res.json(result);
//         }
//     });
// });

app.get('/getPrefix', (req, res) => {
    const prefix = new RegExp(`(^|[ ])${req.query.prefix}`, 'i');
    const data = CourseModel.find({
        '$or': [
            { 'subject': { $regex: prefix} },
            { 'number': { $regex: prefix} },
            { 'name': { $regex: prefix} },
        ]
    })
    .sort({'subject': 1, 'number': 1, 'name': 1})
    .exec((err, docs) => {
        if (err)
            res.json(err)
        else
            res.json(docs);
    });
});

// app.post('/addCourse', async (req, res) => {
//     const user = req.body;
//     const newCourse = new CourseModel(user);
//     await newCourse.save();

//     res.json(user);
// });

app.listen(3001, () => {
    console.log('Server up.');
    // const rawdata = fs.readFileSync('./courses.json');
    // const subjects = JSON.parse(rawdata).subjects
    // //console.log(subjects.slice(0, 6))
    // CourseModel.insertMany(subjects, (err, docs) => {
    //     if (err)
    //         console.error(err);
    //     else
    //         console.log(docs);
    // })
});