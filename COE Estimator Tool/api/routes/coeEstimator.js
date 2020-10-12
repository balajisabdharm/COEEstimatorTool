const express = require('express');
const mongoose = require('mongoose');
const { base } = require('../models/data.js');
const router = express.Router();

var effortDays = 0;
var totalEffortDays = 0;

const CoeEstimator = require('../models/data.js');
const nodeEstimator = require('../models/node.js');

router.get('/estimateEffort', (req, res, next) => {
    CoeEstimator.find().exec().then(doc => {
        console.log("Inside find");
        console.log(doc);
    }).catch(err => { console.log("Inside error"); console.log(err) });

    return res.status(200).json({
        message: 'Handling GET request to /coeEstima'
    });
});

router.post('/estimateEffort', async function (req, res, next) {
    var body = req.body;

    var temp = 0;
    effortDays = 0;
    totalEffortDays = 0;

    var completeEffortDays = await estimateEffortLoop(body);
    if (completeEffortDays < 10) {
        completeEffortDays = "0" + completeEffortDays;
    } else {
        completeEffortDays = "" + completeEffortDays;
    }
    res.status(200).json({
        noOfEffortsDays: completeEffortDays
    });
});

async function estimateEffortLoop(body) {
    for (var i = 0; i < body.length; i++) {
        console.log("I value:" + i);
        totalEffortDays = totalEffortDays + await estimateEfforts(body[i])
        console.log("TotalEffortDays:" + totalEffortDays);
    }
    return totalEffortDays;
}

async function estimateEfforts(body) {
    // console.log("Name and Environment for Estimation:" + req.name + '|' + req.environment);
    var req = {
        "body": {
        }
    };
    req.body = body;
    console.log("Name and Environment for Estimation:" + req.body.name + '|' + req.body.environment);

    try {
        //Base Effort Estimation
        var baseEffort = await CoeEstimator.findOne({ 'name': req.body.name, 'type': req.body.type, 'environment': req.body.environment }).exec();
        effortDays = baseEffort.effortDays;
        console.log("Effort Days BaseEffort:" + effortDays);

        //Pre Req Effort Estimation
        if (req.body.preReq === "false") {
            console.log("Pre-Req is False");
            effortDays = effortDays + 7;
        }

        //MasterNode Effort Estimation
        var masterEffort = await nodeEstimator.find({ 'node': "Master", "environment": req.body.environment }).exec();
        var temp = 0;
        masterEffort.forEach(doc => {
            if (parseInt(req.body.masterNodeNo) >= parseInt(doc.noOfNode)) {
                console.log(doc.effortDays);
                temp = doc.effortDays;
            }
        });
        effortDays = effortDays + parseInt(temp);
        console.log("Effort Days MasterNode:" + effortDays);

        //WorkerNode Effort Estimation
        var workerEffort = await nodeEstimator.find({ 'node': "Worker", "environment": req.body.environment }).exec();
        var workerTemp = 0;
        workerEffort.forEach(doc => {
            if (parseInt(req.body.workerNodeNo) >= parseInt(doc.noOfNode)) {
                console.log(doc.effortDays);
                workerTemp = doc.effortDays;
            }
        });
        effortDays = effortDays + parseInt(workerTemp);
        console.log("Effort Days WorkerNode:" + effortDays);

        //Days Based on cluster

        if (req.body.cluster === "dr" || req.body.cluster === "prod") {
            effortDays = effortDays + 3;
        }
        return effortDays;
    } catch (err) {
        console.log(err)
        return res.status(500).send();
    }
}

/*async function estimateEfforts(body) {
      // console.log("Name and Environment for Estimation:" + req.name + '|' + req.environment);
      var req = {
          "body" :{

          }
      };
      req.body = body;
      console.log("Name and Environment for Estimation:" + req.body.name + '|' + req.body.environment);
      
  var baseEffort = await CoeEstimator.findOne({'name':req.body.name,'type':req.body.type,'environment':req.body.environment}).exec().then(doc=>{
      console.log("Inside find");
      console.log(doc);

     effortDays = doc.effortDays;
      if(req.body.preReq === "false") {
          console.log("Pre-Req is False");
          effortDays = effortDays + 7;
      } 
    
      nodeEstimator.find({'node':"Master","environment":req.body.environment}).exec().
      then(doc=>{
          var temp = 0;
          doc.forEach(doc => {
               if(parseInt(req.body.masterNodeNo) >= parseInt(doc.noOfNode)) {
                  console.log(doc.effortDays);
                  temp = doc.effortDays;
              }
          });
          effortDays = effortDays + parseInt(temp);
          
            nodeEstimator.find({'node':"Worker","environment":req.body.environment}).exec().
              then(doc=>{
                  var workerTemp=0;
                  doc.forEach(doc => {
                      if(parseInt(req.body.workerNodeNo) >= parseInt(doc.noOfNode)) {
                          console.log(doc.effortDays);
                          workerTemp = doc.effortDays;
                      }
                  });
                  effortDays = effortDays + parseInt(workerTemp);
                  console.log("No of Efforts:" + effortDays);
                  return effortDays;
              }).
              catch(err=>{
                  console.log("Inside error");console.log(err)
              });
      }).
      catch(err=>{
          console.log("Inside error");console.log(err)
      });   
   }).catch(err=> {console.log("Inside error");console.log(err)});
}*/

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: "You Discovered productId",
            id: id
        });
    } else {
    }
    res.status(200).json({
        message: 'Couldnt find the Product Id'
    });
});

module.exports = router;