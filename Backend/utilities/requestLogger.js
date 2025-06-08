const fs = require('fs');


 

let requestLogger = (req, res, next) => {

    let userInfo = req.user ? ` userId:${req.user.userId} role:${req.user.role}` : '';

    let logMessage = `${new Date()} ${req.method} ${req.url}${userInfo}\n`;

    fs.appendFile('./loggerFiles/requestLogger.txt', logMessage, (err) => {

        if (err) return next(err);

        else next();

    });

}


 

module.exports = requestLogger;