const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// middle ware
app.use(express.json())
app.use(cors())
app.use(bodyParser.json()); 
// salmamuqtaarsiman
// GBl3hMtRj0hTFcTZ
// GBl3hMtRj0hTFcTZ

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern-job-portal-demo.sisdk6h.mongodb.net/?retryWrites=true&w=majority&appName=mern-job-portal-demo`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//send email
// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'salmam.mohyadiin@gmail.com',
//     pass: 'whbr prza iafx ktpp'
//   }
// });

// var mailOptions = {
//   from: 'salmam.mohyadiin@gmail.com',
//   to: 'sususalax393hh@gmail.com',
//   subject: 'Test Mail',
//   text: 'You applied the job we will contact you thank you.'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });


//chat


// back oo lo jawabayo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'salmam.mohyadiin@gmail.com', // your Gmail account
    pass: 'whbr prza iafx ktpp', // app-specific password for security
  },
});

app.post('/send-confirmation', (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: 'salmam.mohyadiin@gmail.com',
    to: email,
    subject: 'Job Application Confirmation',
    text: 'Shaqada wa applied gareysay waan kula soo xidhiidhi doona insh allah ama Nagala so xidhiid +252 617157083',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Failed to send email');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent successfully');
  });
});














async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // create db
    const db= client.db("mernJobPortal")
    // create collection
    const jobCollections = db.collection("demoJobs")
    const userCollections = db.collection("userCollection");
    const ApplicantCollection = db.collection("ApplicantCollection");
  //  applicants
    app.post("/user/Applicant", async (req, res) => {
      const { email } = req.body;
    
      // Check if email is provided
      if (!email) {
        return res.status(400).send({
          message: "Email is required.",
          status: false
        });
      }
    
      // Check if the email already exists in the ApplicantCollection
      const existingEmail = await ApplicantCollection.findOne({ email });
      if (existingEmail) {
        return res.status(400).send({
          message: "Email already exists.",
          status: false
        });
      }
    
      // Create a new applicant object
      const newApplicant = {
        email,
        createdAt: new Date()
      };
    
      // Insert the new applicant into the ApplicantCollection
      const result = await ApplicantCollection.insertOne(newApplicant);
    
      if (result.insertedId) {
        return res.status(200).send({
          message: "Email sent successfully.",
          status: true
        });
      } else {
        return res.status(500).send({
          message: "Cannot insert email. Please try again.",
          status: false
        });
      }
    });
    // get applicants
    app.get("/get/applicants" , async (req, res) => {
      const applicant= await ApplicantCollection.find({}).toArray()
      res.send(applicant)
    })
    

// post register
app.post("/user/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send({
      message: "Username, email, and password are required.",
      status: false
    });
  }
  const existingUser = await userCollections.findOne({ email });
  if (existingUser) {
    return res.status(400).send({
      message: "User already exists.",
      status: false
    });
  }
  const newUser = {
    username,
    email,
    password,
    createdAt: new Date()
  };
  const result = await userCollections.insertOne(newUser);
  if (result.insertedId) {
    return res.status(200).send({
      message: "User registered successfully.",
      status: true
    });
  } else {
    return res.status(500).send({
      message: "Cannot insert user. Please try again.",
      status: false
    });
  }
});
// get register
app.get("/get-user" , async (req, res) => {
  const users= await userCollections.find({}).toArray()
  res.send(users)
})
// get single user
app.get("/single/user/:id", async(req,res) => {
  const id = req.params.id;
  const user = await userCollections.findOne({
    _id: new ObjectId(id)
  })
  res.send(user);
})
// delete user
app.delete("/user/:id", async(req,res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const result = await userCollections.deleteOne(filter)
  res.send(result)
});
// update
app.put("/user/update/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const update = { $set: req.body }; // Assuming req.body contains the fields to update
  const options = { returnOriginal: false };
  try {
      const result = await userCollections.findOneAndUpdate(filter, update, options);
      if (result.value) {
          res.status(200).send({
              message: "User updated successfully.",
              status: true
          });
      } else {
          res.status(400).send({
              message: "User not found.",
              status: false
          });
      }
  } catch (error) {
      res.status(500).send({
          message: "Cannot update user. Please try again.",
          status: false
      });
  }
});

// email applican

// login
app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      message: "Email and password are required.",
      status: false
    });
  }
  const existingUser = await userCollections.findOne({ email, password });
  if (!existingUser) {
    return res.status(400).send({
      message: "Email or password is incorrect.",
      status: false
    });
  }
  return res.status(200).send({
    message: "Login successful.",
    status: true
  });
  } catch (error) {
    console.log(error)
    
  }
  
});
  // post a job
    app.post("/post-job" , async (req, res) => {
      const body = req.body;
      body.createAt =new Date();
      // console.log(body)
      const result = await jobCollections.insertOne(body);
      // validate
      if(result.insertedId){
        return res.status(200).send(result)
      }else{
        return res.status(404).send({
          message: "Cannot insert job try Again",
          status: false
        })
      }
    })   
 
    // get all jobs
    app.get("/all-jobs", async(req,res) => {
      const jobs = await jobCollections.find({}).toArray()
      res.send(jobs);

    })

    // get jobs my email
    app.get("/myJobs/:email" , async(req,res) => {
      // console.log(req.params.email)
    const jobs = await jobCollections.find({postedBy : req.params.email}).toArray();
    res.send(jobs);
    
    })
    // get single job by id
    app.get("/all-jobs/:id", async(req,res) => {
      const id = req.params.id;
      const job = await jobCollections.findOne({
        _id: new ObjectId(id)
      })
      res.send(job);
    })
    // delete job
    app.delete("/job/:id", async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await jobCollections.deleteOne(filter)
      res.send(result)
    });
   
    // get single job using id
    app.get("/all-jobs/:id", async(req,res) => {
      const id = req.params.id;
      const jobs = await jobCollections.findOne({
        _id : new ObjectId(id)
      })
      res.send(jobs)
    })
    // SIngle update on my jobs
    app.patch("/update-job/:id", async(req,res) => {
      const id = req.params.id;
      const jobData = req.body
      const filter = {_id: new ObjectId(id)}
      const options = {upsert : true}
      const updateDoc = {
        $set : {
          ...jobData
        },
      }
      const result = await jobCollections.updateOne(filter,updateDoc,options)
      res.send(result)
      
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your Database. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello hhhh!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})