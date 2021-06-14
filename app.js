// Seting up the server, routes and middleware //

/*
Requiring dependencies : 
    Express
    Nodemon
    data.json file
Creating an express application
*/

const express = require('express') ;
const { reset } = require('nodemon') ;
const data = require('./data.json') ;
const app = express() ;

/*
Setting up the middleware :
    Setting the view engine to pug
    Using a static route and the express.static method to serve the static files located in the public folder
*/

app.set('view engine', 'pug') ;
app.use('/static', express.static('public')) ;

/*
Setting up the routes :
    A route to render the index page, with the locals set to data.projects
    A route to render the about page
    A route to render each project page, with a project local object passed to the project view
*/

app.get('/', (req, res) => {
    res.locals.projects = data.projects ;
    res.render('index') ;
}) ;

app.get('/about', (req, res) => {
    res.render('about') ;
}) ;

data.projects.forEach(project => {
    app.get(`/projects/${project.id}`, (req, res) => {
        res.render('project', {project})
})
}) ;

/*
Starting the server :
    The app listens on port 3000, and logs a message to the console to say so
*/

const port = 3000 ;

app.listen(port, () => {
    console.log(`The app is listening at http://localhost:${port}`) ;
}) ;

// Handling errors //

/*
If a user navigates to an undefined route, or if a request for a resource fails for whatever reason :
    A 404 handler catches the event and creates a new error with a 404 status and a custom error message
    Then a global error handler deals with any server errors the app encounters
        For a 404 error status code, the page-not-found view is rendered
        For any other error status codes, the error view is rendered
*/

app.use((req, res, next) => {
    const err = new Error() ;
    err.status = 404 ;
    err.message = 'The requested route was not found !' ;
    next(err)
  }) ;

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).render('page-not-found', {err}) ;
    } else {
        err.message = 'There was an error !' ;
        res.status(err.status).render('error', {err}) ;
    }
    console.log(err.status) ;
    console.log(err.message)
  });