const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req,res, next)).catch((err)=> {

        if(err.code === 11000){
            const field = Object.keys(err.keyPattern)[0];
            const error = new Error(`${field} already exists`);
            error.status = 400;
            return next(error);
        }
        next(err)
    })
}

module.exports = asyncHandler;