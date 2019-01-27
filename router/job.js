const express = require('express');
const router = express.Router();
const mongoose =  require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const fileFilter =(req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
    
    
};

const upload = multer ({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
},
    fileFilter: fileFilter
});

const Job = require('../models/job');
/*const Reason = require('../models/reason');
const Fault = require('../models/fault');
const Machine = require('../models/machine');
*/
router.get("/", (req, res, next)=> {
    Job.find()
    .select('inventory description jobNo _id jobImage')
    //.populate('machine reason fault')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            jobs: docs.map(doc => {
                return {
                    _id: doc._id,
                    jobNo:doc.jobNo,
                    //reason: doc.reason,
                   // fault:doc.fault,
                    inventory: doc.inventory,
                    description: doc.description,
                    jobImage: doc.jobImage,
                    request: {
                        type: 'GET',
                        url:'http://localhost:3000/jobs/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
});

 
router.post("/", upload.single('jobImage'),(req, res, next)=> {
  //console.log(req.file);
    /*Reason.findById(req.body.reasonId)
    .then(reason => {
        if(!reason) {
            return res.status(404).json({
                message: "Reason not found"
            });
        }
       })
    Fault.findById(req.body.faultId)
    .then(fault => {
        if(!fault) {
            return res.status(404).json({
                message:"Fault not found"
            });
        }
    })
    Machine.findById(req.body.machineId)
    .then(machine => {
        if(!machine) {
            return res.status(404).json({
                message:"Machine not found"
            });
        }
    })*/
    const job = new Job ({
        _id: mongoose.Types.ObjectId(),
        jobNo:req.body.jobNo,
        inventory: req.body.inventory,
        description:req.body.description,
        jobImage: req.file.path
        //machine:req.body.machineId,
       // reason: req.body.reasonId,
        //fault: req.body.faultId,
    });
    job
    .save()
    
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Job Stored',
            createdJob: {
                //_id: result._id,
                jobNo: result.jobNo,
               // machine:result.machine,
                //reason: result.reason,
                //fault: result.fault,
                inventory: result.inventory,
                description:result.description
            },
            request: {
                type: 'GET',
                url:'http://localhost:3000/jobs/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get("/:jobId", (req, res, next)=>{
    const id = req.params.jobId;
    Job.findById(id)
    .select('jobNo inventory description jobImage _id')
    .exec()
    .then(doc => {
        console.log("From Database",doc);
        if(doc){
            res.status(200).json({
                job: doc,
                request: {
                    type: 'GET',
                    //description: 'Get all products',
                    url: 'http://localhosts:3000/jobs'
                }
            })
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided Id'
            });
        }
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
        });
    });

module.exports = router;