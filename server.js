const express = require("express");
const cors = require("cors");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bodyParser = require("body-parser");

//Using lowDb to hold the backend data
const db = lowDb(new FileSync('./Lab3-timetable-data.json'));
const userdb = lowDb(new FileSync('./user-timetable.json'));

//Initializing object to user timetable
userdb.defaults({ users: [] }).write();



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


//QUESTION 1
app.get('/api/q1', (req, res) => {
    const data = {};
    let i = 0;

    //Looping through data to get subject and class name
    while (typeof db.get(`[${i}]`).value() !== "undefined") {
        data[i] = db.get(`[${i}]['subject']`).value() + " - "
            + db.get(`[${i}]['className']`).value();
        i++;
    }
    return res.send(data);
})

// QUESTION 2
app.get('/api/q2/:subject', (req, res) => {
    let subjectExists = false;
    const subject = req.params.subject;

    const data = {};

    let i = 0;

    //used to count whenever data is added
    let counter = 0;

    //Looping through data to get the course code for a given subject in the endpoint
    while (typeof db.get(`[${i}]`).value() !== "undefined") {
        if (db.get(`[${i}]['subject']`).value() === subject) {
            subjectExists = true;
            data[counter] = db.get(`[${i}]['catalog_nbr']`).value();
            counter++
        }
        i++;
    }

    if (!subjectExists) {
        res.status(404).send("Subject Not Found\n")
    } else {
        return res.send(data);
    }

})

//QUESTION 3
app.get('/api/q3/:subject/:catalog_nbr/:component?', (req, res) => {
    let subjectExists = false;
    const subject = req.params.subject;
    const catalog_nbr = req.params.catalog_nbr;
    const component = req.params.component;


    let data = {

    };


    let i = 0;
    while (typeof db.get(`[${i}]`).value() !== "undefined") {

        //If there is no component
        if (typeof component === "undefined") {
            //If the subject and course code are found when looping through the data, set the data variable to the course info of the given course
            if (db.get(`[${i}]['subject']`).value() === subject && db.get(`[${i}]['catalog_nbr']`).value() === catalog_nbr) {
                data = db.get(`[${i}]['course_info'][0]`).value();
                return res.send(data);
            } else {
                res.status(404).send("Subject Not Found\n")
            }
            //If there is a component
        } else {
            //CHecks if subject exists
            if (db.get(`[${i}]['subject']`).value() === subject
                && db.get(`[${i}]['catalog_nbr']`).value() === catalog_nbr) {
                //checks if component exists and gets the course info for that course
                if (db.get(`[${i}]['course_info'][0]['ssr_component']`).value() === component) {
                    data = db.get(`[${i}]['course_info'][0]`).value();
                    return res.send(data);
                } else {
                    res.status(404).send("Component Not Found\n")
                }
            } else {
                res.status(404).send("Subject Not Found\n")
            }
        }
        i++;
    }
    return res.send(data);

})

//QUESTION 4
app.post('/api/q4', (req, res) => {
    const timetable = req.body;
    let timeTableExists = false;

    let i = 0;

    //Going into the user timetable data to check if the timetable the user wants to add already exists
    while (typeof userdb.get(`timetables[${i}]`).value() !== "undefined") {
        if (userdb.get(`timetables[${i}]['timetable_name']`).value() === timetable['timetable_name']) {
            timeTableExists = true;

            break;
        }
        i++;
    }
    if (timeTableExists) {
        res.status(403).send("Timetable already exists")
        //If the timetable does not already exist, push it into the timetable variable in the user timetables
    } else {
        userdb.get('timetables').push(timetable).write();
        res.json({ success: true })
    }



})

//QUESTION 5
app.put('/api/q5', (req, res) => {
    const timetable = req.body;
    let timeTableExists = false

    const subject = timetable['subject'];
    const catalog_nbr = timetable['catalog_nbr'];
    const course = {
        "subject": subject,
        "catalog_nbr": catalog_nbr

    }


    let i = 0;

    //Loops through user timetable data and pushes the provided body to courses[]
    while (typeof userdb.get(`timetables[${i}]`).value() !== "undefined") {
        if (userdb.get(`timetables[${i}]['timetable_name']`).value() === timetable['timetable_name']) {
            userdb.get(`timetables[${i}]['courses']`).push(course).write();
            timeTableExists = true;
            break;
        }
        i++;
    }
    if (timeTableExists) {
        res.send("timetable courses updated")
    } else {
        res.status(404).send("Timetable Not Found\n")
    }
})


//QUESTION 6
app.get('/api/q6/:timetable_name', (req, res) => {
    const timetable_name = req.params.timetable_name;

    let data = {};

    let timetableExists = false;
    let i = 0;
    while (typeof userdb.get(`timetables[${i}]`).value() !== "undefined") {

        if (userdb.get(`timetables[${i}]['timetable_name']`).value() === timetable_name) {
            data = userdb.get(`timetables[${i}]['courses']`)
            timetableExists = true;
            break;
        }
        i++
    }
    if (!timetableExists) {
        res.status(404).send("Timetable Not Found\n")
    } else {
        res.send(data);
    }
})




//QUESTION 7
app.delete('/api/q7', (req, res) => {
    const timetable = req.body;
    let timeTableExists = false;

    let i = 0;
    while (typeof userdb.get(`timetables[${i}]`).value() !== "undefined") {
        if (userdb.get(`timetables[${i}]['timetable_name']`).value() === timetable['timetable_name']) {
            userdb.get('timetables')
                .remove({ timetable_name: timetable['timetable_name'] })
                .write();
            timeTableExists = true;
            break;
        }

        i++
    }
    if (!timeTableExists) {
        res.status(404).send("Timetable Not Found\n")
    } else {
        return res.send("timetable deleted")
    }
})


//QUESTION 8
app.get('/api/q8', (req, res) => {
    let data = {};
    let courses = [];

    let i = 0;
    while (typeof userdb.get(`timetables[${i}]`).value() !== "undefined") {
        const timetable_name = userdb.get(`timetables[${i}]['timetable_name']`);

        courses = userdb.get(`timetables[${i}]['courses']`).value();

        data[i] = "Timetable name: " + timetable_name + ", Number of courses: " + courses.length;

        i++

    }

    if (data.length != 1) {
        res.send(data)
    } else {
        res.send("No timetables")
    }
})


//QUESTION 9
app.delete('/api/q9', (req, res) => {

    userdb.set('timetables', []).write();
    return res.send("Timetables deleted");


})

//Getting proper course info for the front end
app.get('/api/getCourses/:subject/:catalog_nbr?/:component?', (req, res) => {
    console.log("hljs-emphasisas")
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


//adding a user
app.post('/api/addUser', (req, res) => {
    const user = req.body;
    userdb.get('users').push(user).write();

})

app.get('/api/getUser/:email', (req, res) => {
    const email = req.params.email;

    let i = 0;

    //Going into the user timetable data to check if the timetable the user wants to add already exists
    while (typeof userdb.get(`users[${i}]`).value() !== "undefined") {
        if (userdb.get(`users[${i}]['email']`).value() === email) {
            const user = userdb.get(`users[${i}]`).value();
            return res.send(user);
        }
        i++;
    }
    return res.status(404).send("User not found")

})


