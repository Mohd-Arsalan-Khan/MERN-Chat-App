const notFound = (req, res, next) =>{
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(400)
    next(error)
}

const errorHandler = (req,res,next) =>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: ""
    })
}


export {notFound, errorHandler}