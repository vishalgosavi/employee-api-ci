

const express = require('express');
const { router } = require('./routes/employee-routes');
const cors = require('cors');
var swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

var app = express();
// const PORT = process.env.PORT || 5000;


// app.use(function(req, resp,next){
//     console.log('MiddleWare 1 -request');
//     next();
//     console.log('Middleware 1 - response');
// });

// app.use(function(req, resp,next){
//     console.log('MiddleWare 2 -request');
//     next();
//     console.log('Middleware 2 - response');
// });

// app.use(function(req, resp,next){
//     console.log('MiddleWare 3 -request');
//     next();
//     console.log('Middleware 3 - response');
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// let emps = [
//     { LocationId: 'MUM', EmpCode: 'E1', Name: 'Ajay', Age: 40, Department: 'TECH', Designation: 'Manager' }
// ];

//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

//configure the middleware (including routing middleware)

app.use("/employees", router);

// app.post("/employees", (req,resp) =>{
//     console.log(req.body);
//     let employee = req.body;
//     emps.push(employee);
//     return resp.status(201).json(employee);

// });

app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

app.get("/", (req, resp) => {
    console.log('Home page');
    resp.send(`<html> <head><title>Sample App</title></head>
    <body>
    <h2>welcome to express</h2>
    </body>
    </html>`)
});

app.get("/about", (req, resp) => {
    console.log('about page');
    resp.send(`<html> <head><title>Sample App</title></head>
    <body>
    <h2>welcome to About page</h2>
    </body>
    </html>`)
});

app.get("/contact", (req, resp) => {
    console.log('Contact Page');
    resp.send(`<html> <head><title>Sample App</title></head>
    <body>
    <h2>welcome to contact page</h2>
    </body>
    </html>`)
});

//configure error handlers
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV == "development") {
        console.error(err.stack);
    }
    res.status(500).send({ 'error': 'Something broke!' })
});



module.exports = app;