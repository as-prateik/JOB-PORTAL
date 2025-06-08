const jwt = require('jsonwebtoken');


 

const verifyJWT = (req, res, next) => {

  // Get token from Authorization header (Bearer token)

  const authHeader = req.headers.authorization;


 

  if (!authHeader || !authHeader.startsWith('Bearer ')) {

    return res.status(401).json({ message: 'Authorization token missing or malformed' });

  }


 

  const token = authHeader.split(' ')[1];


 

  try {

    // Verify token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


 

    // Attach user info to request object

    req.user = {

      userId: decoded.id,

      role: decoded.role,

    };


 

    next();

  } catch (err) {

    return res.status(401).json({ message: 'Invalid or expired token' });

  }

};


 

module.exports = { verifyJWT };






