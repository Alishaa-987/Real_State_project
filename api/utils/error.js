// we create that folder of utils to handle error because
// sometime we want to throw error when there is not error
// like if the passowrd is not enough

export const errorHandler = (statusCode , message)=>{
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
}