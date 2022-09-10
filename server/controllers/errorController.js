//handle field formatting, empty fields, and mismatched passwords
import {fieldsName, statusCode} from "../config.js";

const handleValidationError = (err, res) => {
    let errors = Object.values(err.errors).map(el => el.message);
    let fields = Object.values(err.errors).map(el => el.path);
    let code = 400;
    if(errors.length > 1) {
        const formattedErrors = errors.join(' ');
        res.status(code).send({messages: formattedErrors, fields: fields});
    } else {
        res.status(code).send({messages: errors, fields: fields})
    }
}
//handle email or username duplicates
const handleDuplicateKeyError = (err, res) => {
    const field = Object.keys(err.keyValue);
    const code = 409;
    const error = `An account with that ${field} already exists`;
    res.status(code).send({messages: error, fields: field});
}

const handleNotFound = (err, res) => {
    if(err.field){
        let message = "";
        if(err.field === fieldsName.USERNAME) {
            message = `There is no account associated to this username`
        }
        return res.status(err.code).send({messages: message, fields: err.field});
    }
    return res.status(err.code).send({message: err.message});
}
const handleUnauthorized  = (err, res) => {
    let message = "";
    if(err.field === fieldsName.PASSWORD){
        message = `Incorrect password`
    }
    res.status(err.code).send({messages: message, fields: err.field})
}


const errorController = (err, req, res, next) => {
    try {
        console.log('Congrats you hit the error middleware :');
        console.log(err)
        if(err.name === 'ValidationError') {
            console.log("ValidationError");
            return err = handleValidationError(err, res);
        }
        if(err.code && err.code == 11000) {
            console.log("FormattedError")
            return err = handleDuplicateKeyError(err, res);
        }
        if(err.code && err.code == statusCode.NOTFOUND) {
            return err = handleNotFound(err, res);
        }
        if(err.code && err.code == statusCode.UNAUTHORIZED) {
            return err = handleUnauthorized(err, res);
        }

    } catch(err) {
        res.status(500).send('An unknown error occurred.');
    }
}

export default errorController;