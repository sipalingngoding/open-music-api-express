const ClientError = require("../error/client-error");
const {ValidationError} = require("sequelize");
const ErrorMiddleware = (err,req,res,next) => {
    let statusCode =  null;
    let message = null;
    if(err instanceof ClientError){
        statusCode = err.statusCode;
        message = err.message;
    }else if(err instanceof ValidationError){
        statusCode = 400;
        message = err.message;
    }else{
        /* istanbul ignore next */
        statusCode = 500;
        /* istanbul ignore next */
        message = 'Internal Server Error';
    }
    return res.status(statusCode).json({
        status : 'fail',
        message,
    });
}

module.exports = ErrorMiddleware;