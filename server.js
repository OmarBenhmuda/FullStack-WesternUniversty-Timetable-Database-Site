const express = require("express");
const cors = require("cors");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bodyParser = require("body-parser");
//Using lowDb to hold the backend data
const db = lowDb(new FileSync('./Lab3-timetable-data.json'));
const userdb = lowDb(new FileSync('./user-timetable.json'));
const reviewsdb = lowDb(new FileSync('./reviews.json'));

//Initializing object to user timetable
userdb.defaults({ users: [] }).write();
reviewsdb.defaults({ reviews: [] }).write();


var admin = require("firebase-admin");

var serviceAccount = require("./se3316lab5-594f3-firebase-adminsdk-vinkx-5f4e868910.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});




const app = express();
app.use(cors());
app.use(bodyParser.json());

//Logging requests
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Backend running on port: ${PORT}`)
})


//Getting proper course info for the front end
app.get('/api/getCourses/:subject/:catalog_nbr?/:component?', (req, res) => {
    let courseExists = false;
    const subject = req.params.subject;
    const catalog_nbr = req.params.catalog_nbr;
    const component = req.params.component;


    let data = [];

    let counter = 0;
    let i = 0;
    if (typeof subject !== "undefined" && typeof catalog_nbr !== "undefined" && typeof component !== "undefined") {
        while (typeof db.get(`[${i}]`).value() !== "undefined") {
            if (db.get(`[${i}]['subject']`).value() === subject && db.get(`[${i}]['catalog_nbr']`).value() === catalog_nbr && db.get(`[${i}]['course_info'][0][ssr_component]`).value() === component) {
                data[counter] = db.get(`[${i}]`).value();
                counter++;
                courseExists = true;
            }
            i++;


        }

        if (courseExists) {
            return res.send(data);
        } else {
            res.status(404).send("Course not found\n")
        }
    }

    if (typeof subject !== "undefined" && typeof catalog_nbr !== "undefined" && typeof component === "undefined") {
        while (typeof db.get(`[${i}]`).value() !== "undefined") {
            if (db.get(`[${i}]['subject']`).value() === subject && db.get(`[${i}]['catalog_nbr']`).value() === catalog_nbr) {
                data[counter] = db.get(`[${i}]`).value();
                counter++;
                courseExists = true;
            }
            i++;
        }

        if (courseExists) {
            return res.send(data);
        } else {
            res.status(404).send("Course not found\n")
        }
    }

    if (typeof subject !== "undefined" && typeof catalog_nbr === "undefined" && typeof component === "undefined") {
        while (typeof db.get(`[${i}]`).value() !== "undefined") {
            if (db.get(`[${i}]['subject']`).value() === subject) {
                data[counter] = db.get(`[${i}]`).value();
                counter++;
                courseExists = true;
            }
            i++;
        }

        if (courseExists) {
            return res.send(data);
        } else {
            res.status(404).send("Course not found\n")
        }
    }

})

app.get('/api', (req, res) => {
    let data = [];
    let i = 0;
    while (typeof db.get(`[${i}]`).value() !== "undefined") {
        data[i] = db.get(`[${i}]`).value();
        i++;
    }
    return res.send(data);

})

app.get('/api/getCoursesByKeyword/:keyword', (req, res) => {
    const keyword = req.params.keyword;


    let data = [];

    let counter = 0;
    let i = 0;

    if (keyword >= 4) {


        while (typeof db.get(`[${i}]`).value() !== "undefined") {
            if (db.get(`[${i}]['catalog_nbr']`).includes(keyword).value() || db.get(`[${i}]['className']`).includes(keyword).value()) {
                data[counter] = db.get(`[${i}]`).value();
                counter++;
                courseExists = true;
            }
            i++;
        }

        if (courseExists) {
            return res.send(data);
        } else {
            res.status(404).send("Course not found\n")
        }

    }
    console.log(counter);

})


//adding a user
app.post('/api/addUser', (req, res) => {
    const user = req.body;
    userdb.get('users').push(user).write();

})

app.get('/api/getUser/:email', (req, res) => {
    const email = req.params.email;

    let i = 0;

    while (typeof userdb.get(`users[${i}]`).value() !== "undefined") {
        if (userdb.get(`users[${i}]['email']`).value() === email) {
            const user = userdb.get(`users[${i}]`).value();
            return res.send(user);
        }
        i++;
    }
    return res.status(404).send("User not found")

})

app.post('/api/makeAdmin', (req, res) => {
    console.log('asdad')
    const email = req.body.email;
    let i = 0;

    while (typeof userdb.get(`users[${i}]`).value() !== "undefined") {
        if (userdb.get(`users[${i}]['email']`).value() === email) {
            userdb.set(`users[${i}].type`, 'admin').write();
            return res.json({ success: true });
        }
        i++;
    }
    return res.status(404).send("User not found")



})


app.post('/api/addReview', (req, res) => {
    const reviewedBy = req.body.reviewedBy;
    const subject = req.body.subject;
    const courseCode = req.body.courseCode;
    const date = req.body.date;
    const msg = req.body.msg;

    const id = reviewsdb.get('reviews').value().length;
    const review = {
        "id": id,
        "reviewedBy": reviewedBy,
        "subject": subject,
        "catalog_nbr": courseCode,
        "date": date,
        "msg": msg,
        "visibility": "hidden"
    }

    reviewsdb.get('reviews').push(review).write();
    return res.json({ success: true });





})

app.post('/api/addTimetable', (req, res) => {
    const timetable = req.body.timetable;
    const email = req.body.email;
    const name = req.body.name;

    let i = 0;

    while (typeof userdb.get(`users[${i}]`).value() !== "undefined") {
        if (userdb.get(`users[${i}]['email']`).value() === email) {

            let j = 0;
            while (typeof userdb.get(`users[${i}]['timetables'][${j}]`).value() !== "undefined") {
                if (j == 19) {
                    return res.send("Max")
                }
                if (userdb.get(`users[${i}]['timetables'][${j}]['name']`).value() === name) {
                    return res.status(403).send("Timetable already exists");
                }

                j++
            }
            userdb.get(`users[${i}]['timetables']`).push(timetable).write();
            return res.json({ success: true });
        }
        i++;
    }
    return res.status(404).send("User not found");

})

app.post('/api/deleteTimetable', (req, res) => {
    const email = req.body.email;
    const name = req.body.name;

    let i = 0;

    while (typeof userdb.get(`users[${i}]`).value() !== "undefined") {
        if (userdb.get(`users[${i}]['email']`).value() === email) {
            let j = 0;
            while (typeof userdb.get(`users[${i}]['timetables'][${j}]`).value() !== "undefined") {


                if (userdb.get(`users[${i}]['timetables'][${j}]['name']`).value() === name) {



                    userdb.get(`users[${i}]['timetables']`).remove({ name: name }).write();
                    return res.json({ success: true });
                }

                j++
            }

            return res.status(404).send("Timetable Not Found");
        }
        i++;
    }
    return res.status(404).send("User not found");
})

app.post('/api/addCourse', (req, res) => {
    const name = req.body.name;
    const course = req.body.course;
    const date = req.body.date;
    const email = req.body.email;


    let i = 0;

    while (typeof userdb.get(`users[${i}]`).value() !== "undefined") {
        if (userdb.get(`users[${i}]['email']`).value() === email) {

            let j = 0;
            while (typeof userdb.get(`users[${i}]['timetables'][${j}]`).value() !== "undefined") {
                if (userdb.get(`users[${i}]['timetables'][${j}]['name']`).value() === name) {
                    console.log("sss")
                    userdb.get(`users[${i}]['timetables'][${j}]['courses']`).push(course).write();
                    userdb.set(`users[${i}]['timetables'][${j}]['lastEdited']`, date).write();

                    return res.json({ success: true });
                }

                j++
            }
            return res.status(404).send("Timetable does not exists");

        }
        i++;
    }
    return res.status(404).send("User not found");

})


app.get('/api/findTimetable/:email/:timetable_name', (req, res) => {
    const email = req.params.email;
    const timetable_name = req.params.timetable_name;

    let data = {};
    let i = 0;

    while (typeof userdb.get(`users[${i}]`).value() !== "undefined") {
        if (userdb.get(`users[${i}]['email']`).value() === email) {
            let j = 0;
            while (typeof userdb.get(`users[${i}]['timetables'][${j}]`).value() !== "undefined") {
                if (userdb.get(`users[${i}]['timetables'][${j}]['name']`).value() === timetable_name) {
                    data = userdb.get(`users[${i}]['timetables'][${j}]['courses']`)
                    return res.send(data);
                }

                j++
            }

            return res.status(404).send("Timetable Not Found");
        }
        i++;
    }
    return res.status(404).send("User not found");
})


app.post('/api/changeReviewVisibility', (req, res) => {
    const id = req.body.id;

    let i = 0;
    while (typeof reviewsdb.get(`reviews[${i}]`).value() !== "undefined") {
        if (reviewsdb.get(`reviews[${i}]['id']`).value() == id) {

            const visibility = reviewsdb.get(`reviews[${i}]['visibility']`).value()
            let newVisibility
            if (visibility == "visible") {
                newVisibility = "hidden"
            } else {
                newVisibility = "visible"
            }
            reviewsdb.set(`reviews[${i}]['visibility']`, newVisibility).write()
            return res.json({ success: true });
        }
        i++;
    }
    console.log("asd");
    return res.status(404).send("Review not found");
})

app.post('/api/changeUserAccess', (req, res) => {
    const email = req.body.email;

    admin
        .auth()
        .getUserByEmail(email)
        .then((userRecord) => {
            const user = userRecord.toJSON();
            if (user.disabled) {
                admin.auth().updateUser(user.uid, {
                    disabled: false
                });

            } else {
                admin.auth().updateUser(user.uid, {
                    disabled: true
                });
            }



            return res.json({ success: true });

        }).catch(e => {
            return res.status(404).send(e)
        })

})