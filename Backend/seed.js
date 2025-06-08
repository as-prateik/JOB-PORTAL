require('dotenv').config();

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const connectDB = require('./config/db');

const Auth = require('./models/auth.model');

const User = require('./models/user.model');

const Job = require('./models/job.model');


 

const seed = async () => {

  await connectDB();


 

  try {

    // Clear collections

    await Auth.deleteMany();

    await User.deleteMany();

    await Job.deleteMany();


 

    const users = [

      {name:'abinaya' , username: 'abinaya', email: 'abinaya.trn@infosys.com', password: 'AbinayaEmp@678', role: 'employee',skills:['java','python','mySql','JavaScript','React'],certifications:['Nptel - DBMS','Completion of Java Course','AWS Certified'] },

      {name:'ritika', username: 'ritika', email: 'ritika.verma@infosys.com', password: 'RitikaHR!321', role: 'hr' ,skills:['JavaScript','React'],certifications:['AWS Certified']},

      {name:'kishore', username: 'kishore', email: 'kishore.trn@infosys.com', password: 'KishoreHR@789', role: 'hr',skills:['python','JavaScript','React'],certifications:['AWS Certified','cyber security'] },

      {name:'arjun', username: 'arjun', email: 'arjun.nair@infosys.com', password: 'ArjunPwd$321', role: 'manager',skills:['JavaScript','React'],certifications:['AWS Certified'] },

      {name:'karan' , username: 'karan', email: 'karan.desai@infosys.com', password: 'KaranM@123', role: 'manager',skills:['JavaScript','React'],certifications:['AWS Certified'] },

      {name:'prateik' , username: 'prateik',email:'prateik123@infosys.com',password:'password456',role:'employee',skills:['AWS','JavaScript','React'],certifications:['AWS Certified','python pro']}

    ];


 

    function generateJobId() {

      return `JOB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    }


 

    let employeeIdCounter = 1001;

    const userProfiles = [];


 

    // Create auth + profile for each

    for (const user of users) {

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const auth = await Auth.create({

        username: user.username,

        password: hashedPassword,

        role: user.role.toLowerCase(),

        name: user.name || user.username

      });


 

      const profile = await User.create({

        authId: auth._id,

        employeeId: employeeIdCounter++,

        username: user.username,

        name: user.name,

        role: user.role.toLowerCase(),

        email: user.email,

        skills: user.skills || [],

        certifications: user.certifications || []

      });


 

      userProfiles.push({ auth, profile });

    }


 

    // Optional: create a sample job posted by one of the managers

    const manager = userProfiles.find(u => u.profile.role === 'manager');

    const job = await Job.create({

      jobId: generateJobId(),

      title: 'Node.js Developer',

      description: 'Backend development role',

      skillsRequired: ['Node.js', 'MongoDB'],

      department: 'Engineering',

      location: 'Chennai',

      salary: 95000,

      postedBy: manager.profile.username,

      lastDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),

    },{

      jobId: generateJobId(),

      title: 'Angular Developer',

      description: 'Frontend development role',

      skillsRequired: ['Angular', 'TypeScript'],

      department: 'Engineering',

      location: 'Hyderabad',

      salary: 90000,

      postedBy: manager.profile.username,

      lastDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),

    });


 

    console.log('✅ Seed data inserted successfully!');

    process.exit(0);

  } catch (err) {

    console.error('❌ Error during seeding:', err);

    process.exit(1);

  }

};


 

seed();