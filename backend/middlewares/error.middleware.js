const errorMiddleware = (err, req, res, next) => {
    try{
        let error = { ...err };

        error.message = err.message;

        console.error(err);


        //Mongoose bad ObjectID
        if(err.name === 'CastError'){
            error.message = 'Resource not found'
            error = new Error(message);
            error.statusCode= 404;
        }        

        //Mongoose duplicate key
        if(err.name === 11000){
            error.message = 'Duplicate field value entered'
            error = new Error(message);
            error.statusCode= 400;
        }    


        //Mongoose Validation Error
        if(err.name === 'ValidationError'){
            error.message = Object.values(err.errors).map(val => val.message)
            error = new Error(message.join(','));
            error.statusCode= 400;
        }    

        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error'})


    } catch(error){
        next(error);
    }
}

module.exports = errorMiddleware;