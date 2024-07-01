  const express = require('express')
  const mongoose = require('mongoose')
  const cors = require('cors')
  const VehicleModel = require('./models/Users')
  const CreateUserModel = require('./models/Createuser')
  const UserloginModel = require('./models/Userlogin')
  const AdminloginModel = require('./models/Adminlogin')
  const SlotsModel = require('./models/Slots')

  const app = express()
  app.use(cors())
  app.use(express.json())

  mongoose.connect('mongodb://localhost:27017/VehilceSlotBookingData');
  // mongoose.connect("mongodb+srv://ashu04906:Jsa0Of37buSk9VfY@db-test-pro.evfn1je.mongodb.net/?retryWrites=true&w=majority&appName=db-test-pro")

  // mongoose.connect('mongodb://127.0.0.1:27017/VehilceSlotBookingData');


  // user login
  app.post("/createUserlogin", (req, res) => {
    console.log('mydata',req.body)
    UserloginModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
  })
  // Admin login
  app.post("/createAdminlogin", (req, res) => {
    console.log('mydata',req.body)
    AdminloginModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
  })

  //slots
  app.post("/createSlots", (req, res) => {
    console.log('mydata',req.body)
    SlotsModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
  })

  app.get("/getslots", async(req, res) => {
    // console.log('mydata',req.body)
    // SlotsModel.find({})
    //   .then(slots => res.json(slots))
    //   .catch(err => res.status(500).json({ error: err.message }));
    try{
      const slots = await SlotsModel.find({})
      res.send({status:"ok", data: slots})
    }
    catch(err){
      res.send({status:"error", message: err.message})
    }
  });

  //total count
  app.get("/getTotalSlotCount", async (req, res) => {
    try {
      const count = await SlotsModel.countDocuments({});
      res.json({ totalSlots: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });




  // app.post("/createVehicle", (req, res) => {
  //   VehicleModel.create(req.body)
  //         .then(users => res.json(users))
  //         .catch(err => res.json(err))
  // });
  app.post("/createVehicle", async (req, res) => {
    const { vehicleName, vehicleNum, contactNum } = req.body;
    
    // Check if the vehicle number already exists
    const existingVehicle = await VehicleModel.findOne({ vehicleNum });
    if (existingVehicle) {
      return res.status(400).json({ error: 'Vehicle number already exists' });
    }
    
    // Create a new vehicle
    const newVehicle = new VehicleModel({ vehicleName, vehicleNum, contactNum });
    newVehicle.save()
      .then(vehicle => res.status(201).json(vehicle))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // GET endpoint to fetch all vehicles
  app.get("/vehicles", (req, res) => {
    VehicleModel.find({})
      .then(vehicles => res.json(vehicles))
      .catch(err => res.status(500).json({ error: err.message }));
  });

  //total vehicles
  

  


  //createuser
  app.post("/createCreateuser", (req, res) => {
    CreateUserModel.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err))
  });


  app.get("/vehicles", (req, res) => {
    VehicleModel.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ error: err.message }));
    });
    
    //total vehicles
    app.get("/getTotalVehiclesCount", async (req, res) => {
      try {
        const count = await VehicleModel.countDocuments({});
        res.json({ totalVehicles: count });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    //individual
app.get('/vehicles/counts', (req, res) => {
  VehicleModel.aggregate([
      {
          $group: {
              _id: '$vehicleName',
              count: { $sum: 1 } // Count occurrences of each vehicleName
          }
      }
  ])
  .then(vehicleCounts => {
      const countsMap = {};
      vehicleCounts.forEach(item => {
          countsMap[item._id] = item.count;
      });
      res.json(countsMap);
  })
  .catch(err => res.status(500).json({ error: err.message }));
});
    


    //get slots
  app.get("/slots", (req, res) => {
    SlotsModel.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ error: err.message }));
    });

    // booked slots count 
    

    //booked slots
    app.get("/slots", (req, res) => {
      SlotsModel.aggregate([
        {
          $group: {
            _id: "$selectedVehicle",
            count: { $sum: 1 },
          },
        },
      ])
      
        .then((result) => {
          const vehicleCounts = {};
          result.forEach((item) => {
            vehicleCounts[item._id] = item.count;
          });
          res.json(vehicleCounts);
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    });

//filter slots
app.get('/slots', async (req, res) => {
  const { fromDate, toDate } = req.query;

  try {
      let query = {};

      if (fromDate && toDate) {
          // Convert fromDate and toDate to MongoDB date format
          const from = moment(fromDate).startOf('day').toDate();
          const to = moment(toDate).endOf('day').toDate();

          // Add date range condition to the query
          query = {
              createdAt: {
                  $gte: from,
                  $lte: to
              }
          };
      }

      const slots = await SlotsModel.find(query);
      res.json(slots);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



    //update slot
app.put('/updateslots/:id' , (req,res) => {
  const id = req.params.id;
  SlotsModel.findByIdAndUpdate(id, {
    selectedVehicle: req.body.selectedVehicle,
    selectedDate: req.body.selectedDate,
    fromTime: req.body.fromTime,
    toTime: req.body.toTime,
    vehicleNumber: req.body.vehicleNumber,
    villaNumber: req.body.villaNumber,
    bookedBy: req.body.bookedBy,
    status: req.body.status,
  }, { new: true }) // Set { new: true } to return the updated document
  .then(updatedSlot => {
    if (!updatedSlot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    res.json(updatedSlot);
  })
  .catch(err => res.status(500).json({ error: err.message }));
});


  //   app.delete('/deleteslots/:id', (req, res) => {
  //     const id = req.params.id;
  //     SlotsModel.findByIdAndDelete({_id:id})
  //     .then(res => res.json(res))
  //     .catch(err => res.status(500).json({ error: err.message }));
  // })

    //createuser
  app.get("/createusers", (req, res) => {
      CreateUserModel.find({})
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ error: err.message }));
    });

    //total users
    app.get("/getTotalCreateusersCount", async (req, res) => {
      try {
        const count = await CreateUserModel.countDocuments({});
        res.json({ totalusers: count });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });




    app.get('/getVehicle/:id' , (req , res) => {
      const id = req.params.id;
      VehicleModel.findById({_id:id})
      .then(users => res.json(users))
      .catch(err => res.status(500).json({ error: err.message }));
    })

    //createuser
    app.get('/getCreateuser/:id' , (req , res) => {
      const id = req.params.id;
      CreateUserModel.findById({_id:id})
      .then(user => res.json(user))
      .catch(err => res.status(500).json({ error: err.message }));
    })


  //   app.put('/updateVehicle/:id' , (req,res) => {
  //     const id = req.params.id;
  //     VehicleModel.findByIdAndUpdate({_id:id},{
  //         vehicleName: req.body.vehicleName,
  //         vehicleNum: req.body.vehicleNum,
  //         contactNum: req.body.contactNum,
  //     })  
  //     .then(users => res.json(users))
  //     .catch(err => res.status(500).json({ error: err.message }));
  // })
  app.put('/updateVehicle/:id', (req, res) => {
    const id = req.params.id;
    VehicleModel.findByIdAndUpdate(id, {
      vehicleName: req.body.vehicleName,
      vehicleNum: req.body.vehicleNum,
      contactNum: req.body.contactNum,
    }, { new: true }) // Use { new: true } to return the updated document
      .then(updatedVehicle => res.json(updatedVehicle))
      .catch(err => res.status(500).json({ error: err.message }));
  });


  //createuser
    app.put('/updateCreateuser/:id' , (req,res) => {
      const id = req.params.id;
      CreateUserModel.findByIdAndUpdate({_id:id},{
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          designation: req.body.designation,
          contact: req.body.contact,
      })  
      .then(user => res.json(user))
      .catch(err => res.status(500).json({ error: err.message }));
  })


  //delete user
  app.delete('/deleteCreateuser/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Delete user error:', err);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });



  app.delete('/deleteVehicle/:id', (req, res) => {
      const id = req.params.id;
      VehicleModel.findByIdAndDelete({_id:id})
      .then(res => res.json(res))
      .catch(err => res.status(500).json({ error: err.message }));
  })

  // deleteslot
  // app.delete('/deleteslots/:id', (req, res) => {
  //     const id = req.params.id;
  //     SlotsModel.findByIdAndDelete({_id:id})
  //     .then(res => res.json(res))
  //     .catch(err => res.status(500).json({ error: err.message }));
  // })
  
  //create user
  app.delete('/deleteslots/:id', (req, res) => {
    const id = req.params.id;
    SlotsModel.findByIdAndDelete(id) // Only pass the ID, not {_id: id}
      .then(deletedSlot => {
        if (!deletedSlot) {
          // If no slot was found with the provided ID
          return res.status(404).json({ error: 'Slot not found' });
        }
        res.json({ message: 'Slot deleted successfully', deletedSlot });
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });

  app.listen(3000, () => {
  console.log("server is running")
  })




