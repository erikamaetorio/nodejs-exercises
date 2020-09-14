const express = require('express');
const busboy = require('connect-busboy');
const path = require('path');
const app = express();

const doctorModule = require('./routes/doctor');

app.use(express.json());
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
//app.use(busboy());
app.use("/doctors", doctorModule);

const { getHomePage } = require('./routes/index');
app.get('/', getHomePage);
// const { addDoctor, deleteDoctor, editDoctor } = require('./routes/doctor');

// routes for the app
/*
app.post('/add', addDoctor);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/edit/:id', editPlayer);
*/


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening to port ${port}...`));