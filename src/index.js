const express = require('express');
const {albumRoutes, songRoutes} = require("./routes");
const ErrorMiddleware = require("./middleware/error-middleware");

const app = express();

app.use(express.json());

app.use('/albums',albumRoutes);

app.use('/songs',songRoutes);

app.use(ErrorMiddleware);

app.use((req,res)=>{
    res.status(404).json({
        status : 'fail',
        message : 'Route not found',
    });
});

module.exports = app;
