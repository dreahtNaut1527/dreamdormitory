const express = require('express')
const mssql = require('mssql')
const config = require('../config/db.config')()

const router = express.Router()
// ======================== MSSQL Procedure API ========================
// =====================================================================
// ======================= Select Query (MSSQL)=========================
// =====================================================================
  
router.post('/executeselect', (req, res) => {
     let data = JSON.parse(req.body.data)
     let values = data.values
     let sql = `EXECUTE ${data.procedureName}`

     // Loop through values
     if (!Array.isArray(values[0])) {
          values = Array(data.values)
     }

     values.forEach(rec => {
          config.connect(err => {
               if(err) return res.send(err)
               const request = new mssql.Request(config)
               request.query(`${sql} '${rec.join("','").replace(/''/g, null)}'`, (err, results) => {
                    if(err) return res.send(err)
                    res.send(results.recordset)
               })
          })
     })
})


// =====================================================================
// ===================== Insert / Update Query (MSSQL)==================
// =====================================================================
router.post('/execute', (req, res) => {
     let data = JSON.parse(req.body.data)
     let values = data.values
     let sql = `EXECUTE ${data.procedureName}`


     // Loop through values
     if (!Array.isArray(values[0])) {
          values = Array(data.values)
     }
     values.forEach(rec => {
          config.connect(err => {
               if(err) return res.send(err)
               const request = new mssql.Request(config)
               request.query(`${sql} '${rec.join("','").replace(/''/g, null)}'`, (err, results) => {
                    if(err) return res.send(err)
                    res.status(200).end()
               })
          })
     })
})

// router.get('/textCommand', (req, res) => {
//      const exec = require('child_process').exec
//      exec('cmd /c ""C:\\Program Files\\HRDev\\XPAApps\\ClinicHealth.lnk""', (err, stdout, stderr) => {
//           if (err) {
//                res.send(err)
//           }
//           res.send(stdout)
//      })
// })

module.exports = router       