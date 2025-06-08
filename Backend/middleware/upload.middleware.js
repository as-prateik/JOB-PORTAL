const multer = require('multer');

const path = require('path');

const fs = require('fs');


 

// Define storage config dynamically based on fieldname

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    let uploadPath = '';


 

    if (file.fieldname === 'resume') {

      uploadPath = 'uploads/resumes/';

    } else if (file.fieldname === 'profilePhoto') {

      uploadPath = 'uploads/photos/';

    } else if (file.fieldname === 'coverLetter') {

      uploadPath = 'uploads/coverletters/';

    } else {

      uploadPath = 'uploads/others/';

    }


 

    // Ensure directory exists

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);

  },

  filename: function (req, file, cb) {

    // Use unique filename: timestamp + original name

    const ext = path.extname(file.originalname);

    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '_');

    cb(null, `${baseName}_${Date.now()}${ext}`);

  }

});


 

// File filter for validation (optional)

const fileFilter = (req, file, cb) => {

  // Accept only certain mime types (example: pdf, docx for resumes)

  const allowedMimeTypes = [

    'application/pdf',

    'application/msword',

    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

    'image/jpeg',

    'image/png',

  ];


 

  if (allowedMimeTypes.includes(file.mimetype)) {

    cb(null, true);

  } else {

    cb(new Error('Unsupported file type'), false);

  }

};


 

// Max file size: 5MB




 

const upload = multer({ storage, fileFilter });


 

module.exports = upload;