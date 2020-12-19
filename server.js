const express = require('express')
const fs = require('fs')
const bp = require('body-parser')
var mysql = require("mysql")
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "productcart"
});

connection.connect()

let logged = false


const app = express()

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))



app.get('/home', (req, res) => {
    if (logged == true) {
        fs.readFile('home.html', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' })
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(data.toString())
            }
            res.end()
        })
    } else {
        res.redirect('/')
    }

})

app.get('/doctors', (req, res) => {
    if (logged == true) {
        const sql = `select * from doctors;`;
        let doctors = []
        let DoctorList = ''

        connection.query(
            sql,
            (err, result) => {
                if (err)
                    throw err;
                doctors = result

                doctors.forEach((doctor) => {
                    DoctorList += `<tr>
                    <td>${doctor.did}</td>
                    <td>Dr.${doctor.dname}</td>
                    <td>${doctor.speciality}</td>
                    <td>$.${doctor.fees}</td>
                    </td>
                </tr>`
                })

                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(`
            <html>
                <head>
                <title>Health Care Systems</title>
                </head>

                <body style="margin-top: 8%;margin-left: 40%;">
                <h1>Health Care Systems</h1>
                <h2><a href="/">Home</a></h2>
                <h3>Doctors Details</h3>
                    <table>
                        <thead>
                            <tr>
                            <th>Doctor-ID</th>                                 
                            <th>Name</th>
                            <th>Speciality</th>
                            <th>Consulting Fees</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${DoctorList}
                        </tbody>
                    </table>

                    <h2>Add/Edit Doctor</h2>
                    <p>(To edit a doctors detail provide their respective id.)</p>
                    <form action="/modifyDoctor" method="POST">
                        <table>
                            <tr>
                                <td><label for="did">Doctor Id</label></td>
                                <td><input type="number" name="did" required></td>
                            </tr>
                            <tr>
                                <td><label for="dname">Name</label></td>
                                <td><input type="text" name="dname" required></td>
                            </tr>
                            <tr>
                                <td><label for="speciality">Speciality</label></td>
                                <td><input  type="text" name="speciality" required></td>
                            </tr>
                            <tr>
                                <td><label for="fees">Consulting Fees</label></td>
                                <td><input min=0 type="number" name="fees" required></td>
                            </tr>
                        </table>
                        <br>
                        <input type="submit" value="Add">
                    </form>

                    <h2>Remove a Doctor</h2>
                    <p>(To remove a doctors detail provide their respective id.)</p>
                    <form action="/removeDoctor" method="POST">
                        <table>
                            <tr>
                                <td><label for="id">ID</label></td>
                                <td><input type="number" name="id" required></td>
                            </tr>
                        </table>
                        <br>
                        <input type="submit" value="Remove">
                    </form>
                </body>
            </html>`)
            })
    } else {
        res.redirect('/')
    }
})

app.get('/patients', (req, res) => {
    if (logged) {
        const sql = `select * from patients;`;
        let patients = []
        let patientList = ''

        connection.query(
            sql,
            (err, result) => {
                if (err)
                    throw err;
                patients = result

                patients.forEach((patient) => {
                    patientList += `<tr>
                    <td>${patient.pid}</td>
                    <td>${patient.fname}</td>
                    <td>${patient.lname}</td>
                    <td>${patient.email}</td>
                    <td>${patient.phone}</td>
                    <td>${patient.date}</td>
                    <td>${patient.time}</td>
                    <td>${patient.doctor}</td>
                    <td>${patient.problem}</td>
                </tr>`
                })

                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(`
            <html>
                <head>
                <title>Health Care Systems</title>
                </head>
                <style>
                td,th{
                    padding:10px;
                }
                </style>

                <body>
                <h1>Health Care Systems</h1>
                <h2><a href="/">Home</a></h2>
                <h3>Patients Details</h3>
                    <table>
                        <thead>
                            <tr>
                            <th>Patient-ID</th>                                 
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>                                 
                            <th>Date</th>
                            <th>Time</th>
                            <th>Doctor</th>
                            <th>Problem</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${patientList}
                        </tbody>
                    </table>
                    <h2>Remove a Appointment</h2>
                    <p>(To remove a appointment detail provide its respective id.)</p>
                    <form action="/removePatient" method="POST">
                        <table>
                            <tr>
                                <td><label for="id">ID</label></td>
                                <td><input type="number" name="id" required></td>
                            </tr>
                        </table>
                        <br>
                        <input type="submit" value="Remove">
                    </form>
                </body>
                </html>`)
            })
    } else {
        res.redirect('/')
    }

})

app.get('/appointment', (req, res) => {
    if (logged) {
        const sql = `select dname from doctors;`;
        let doctors = []
        let docoptions = ''

        connection.query(
            sql,
            (err, result) => {
                if (err)
                    throw err;
                doctors = result
                doctors.forEach((doctor) => {
                    docoptions += `<option value="Dr.${doctor.dname}">Dr.${doctor.dname}</option>`
                })

                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(`
            <html>
                <head>
                <title>Health Care Systems</title>
                </head>

                <body style="margin-top: 8%;margin-left: 40%;">
                <h1>Health Care Systems</h1>
                <h2><a href="/">Home</a></h2>
                <h3>Registration</h3>
                <form action="/addPatient" method="POST">
                        <table>
                            <tr>
                                <td><label for="fname">First Name</label></td>
                                <td><input type="text" name="fname" required></td>
                            </tr>
                            <tr>
                                <td><label for="lname">Last Name</label></td>
                                <td><input type="text" name="lname" required></td>
                            </tr>
                            <tr>
                                <td><label for="email">E-mail</label></td>
                                <td><input  type="email" name="email" required></td>
                            </tr>
                            <tr>
                                <td><label for="phone">Phone No</label></td>
                                <td><input type="tel" name="phone" placeholder="888 888 8888" pattern="[0-9]{10}" maxlength="12"  title="Ten digits code" required/></td>
                            </tr>
                            <tr>
                                <td><label for="date">Appointment Date</label></td>
                                <td><input type="date" name="date" min="2020-01-01" max="2020-12-31" required></td>
                            </tr>
                            <tr>
                                <td><label for="time">Appointment Time</label></td>
                                <td><input type="time" name="time" min="09:00" max="22:00" required>
                            </tr>
                            <tr>
                                <td><label for="doctor">Doctor Name:</label></td>
                                <td>
                                <select name="doctor" required>
                                <option disabled selected value> -- select an option -- </option>
                                    ${docoptions}
                                </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label for="problem">Problem</label></td>
                                <td>
                                <select name="problem" required>
                                <option disabled selected value> -- select an option -- </option>
                                    <option value="Checkup">Checkup</option>
                                    <option value="Fever">Fever</option>
                                    <option value="Others">Others</option>
                                </select>
                                </td>
                            </tr>
                        </table>
                        <br>
                        <input type="submit" value="Book">
                </form>
                    
                </body>
            </html>`)

            })

    } else {
        res.redirect('/')
    }

})

app.post('/addPatient', (req, res) => {
    const { fname, lname, email, phone, date, time, doctor, problem } = req.body

    const sql = `insert into patients(fname,lname,email,phone,date,time,doctor,problem) values('${fname}','${lname}','${email}','${phone}','${date}','${time}','${doctor}','${problem}');`;

    connection.query(
        sql,
        (err, result, feilds) => {
            if (err)
                throw err;
            res.redirect('/patients')
        })

})

app.post('/removePatient', (req, res) => {
    const { id } = req.body

    const sql = `delete from patients where pid = ${id};`;

    connection.query(
        sql,
        (err, result, feilds) => {
            if (err)
                throw err;
            res.redirect('/patients')
        })
})

app.post('/removeDoctor', (req, res) => {
    const { id } = req.body

    const sql = `delete from doctors where did = ${id};`;

    connection.query(
        sql,
        (err, result, feilds) => {
            if (err)
                throw err;
            res.redirect('/doctors')
        })
})

app.post('/modifyDoctor', (req, res) => {
    let { did, dname, speciality, fees } = req.body

    connection.query(
        `select * from doctors where did = ${did};`,
        (err, result, feilds) => {
            if (err)
                throw err;
            if (result.length == 0) {
                const sqlinsert = `insert into doctors(dname,speciality,fees) values ('${dname}','${speciality}',${fees});`;

                connection.query(
                    sqlinsert,
                    (err, result, feilds) => {
                        if (err)
                            throw err;
                        res.redirect('/doctors')
                    })
            } else {
                const sqlupdate = `update doctors set dname = '${dname}',speciality='${speciality}',fees=${fees} where did = ${did};`;

                connection.query(
                    sqlupdate,
                    (err, result, feilds) => {
                        if (err)
                            throw err;
                        res.redirect('/doctors')
                    })
            }
        })
})

app.post('/login', (req, res) => {
    const user = req.body
    const sql = `select * from user_details where uname = '${user.name}'`;

    connection.query(
        sql,
        (err, result, feilds) => {
            if (err)
                throw err;

            if (result.length == 0) {
                res.end(`
                    <html>
                      <head>
                          <title>HealthCare System</title>
                      </head>
    
                      <body style="margin-top: 8%;margin-left: 40%;">
                          <h1>HealthCare System</h1>
                          <h3>Welcome to HealthCare System</h3>
                          <h2>INVALID USERNAME</h2>
                          <form action="/login" method="POST">
                              <table>
                                  <tr>
                                      <td><label for="name">Name</label></td>
                                      <td><input type="text" name="name"></td>
                                  </tr>
                                  <tr>
                                      <td><label>Password</label></td>
                                      <td> <input type="password" name="password"></td>
                                  </tr>
                              </table>
                              <br>
                              <input type="submit" value="Login">
                          </form>
    
                      </body>
                    </html>`)
            } else if (user.password == result[0].password) {
                logged = true
                res.redirect('/home')
            } else {
                res.end(`
                  <html>
                    <head>
                        <title>HealthCare System</title>
                    </head>
  
                    <body style="margin-top: 8%;margin-left: 40%;">
                        <h1>HealthCare System</h1>
                        <h3>Welcome to HealthCare System</h3>
                        <h2>INVALID PASSWORD</h2>
                        <form action="/login" method="POST">
                            <table>
                                <tr>
                                    <td><label for="name">Name</label></td>
                                    <td><input type="text" name="name"></td>
                                </tr>
                                <tr>
                                    <td><label>Password</label></td>
                                    <td> <input type="password" name="password"></td>
                                </tr>
                            </table>
                            <br>
                            <input type="submit" value="Login">
                        </form>
  
                    </body>
                  </html>`)
            }

        })
})

app.post('/logout', (req, res) => {
    logged = false
    res.redirect('/')
})

app.get('/', (req, res) => {
    if (logged == false) {
        fs.readFile('login.html', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' })
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(data.toString())
            }
            res.end()
        })
    } else {
        res.redirect('/home')
    }

})

app.listen(3000, console.log('running in port 3000'))