const fs = require('fs');


 

let errorLogger = (err, req, res, next) => {

    fs.appendFile('./loggerFiles/errorLogger.txt', new Date() + " - " + err.stack + "\n", (error) => {

        if (error) {

            console.log("Failed in logging error");

        }

        // Only send response if not already sent

        next(err);

    });

}


 

module.exports = errorLogger;