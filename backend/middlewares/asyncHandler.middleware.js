const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req,res, next)).catch((err)=> {

        if(err.code === 11000){
            const field = Object.keys(err.keyPattern)[0];
            return next(new Error(400, `${field} already exists}`));
        }
        next(err)
    })
}

module.exports = asyncHandler;