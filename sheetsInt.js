var auth = require('./auth.js');
// var signiture = people.signiture;
var people = require('./constants.js');
var GoogleSpreadsheet = require('google-spreadsheet')
var googleGC = require('./google-generated-creds.json')
var doc = new GoogleSpreadsheet(auth.googleSpreadsheetKey)
var helpers = require('./helpers')
let sheet

module.exports = {
  createServiceAuth() {
    doc.useServiceAccountAuth(auth.creds, (error, success) => {
      if(error) throw error
      else {
        console.log('Now using sheet sheet:', auth.googleSpreadsheetKey)
      }
    })
  },
  setUpDocInfo() {
    doc.getInfo((error, info) => {
      if (error) throw error
      else {
        sheet = info.worksheets[0]
      }
    })
  },
  deletePreviousCells() {
    sheet.getRows({limit: 30, offset: 1}, (err,rows) => {
      console.log(rows)
      if(rows.length > 0){
        rows.forEach((row) => {
          row.del((err, success) => {
            if(err) throw err
            module.exports.deletePreviousCells()
          })
        })
      } else {
        console.log('There aren\' any rows!')
      }
    })
  },
  writeToSheet(data){
    let arrayDateObjs = helpers.formatDataForSheet(data)
    sheet.getCells({'min-row': 2, 'max-row' : (arrayDateObjs.length + 1),'min-col' : 1, 'max-col': 7, 'return-empty' : true}, (err, cells) => {
      for(let i = 0; i < (arrayDateObjs.length * 7); i++){
        cells[i].value = arrayDateObjs[cells[i].row - 2][cells[i].col - 1]
      }
      sheet.bulkUpdateCells(cells)
    })
  },


  initializeSheetWrite(data) {
    // console.log('data 11, sheetsInt', data)
    doc.useServiceAccountAuth(auth.creds, (error, success) => {
      if(error) throw error
      else {
        doc.getInfo(function(error, info) {
          if(error) throw error
          else {
            sheet = info.worksheets[0]
          }
          let arrayDateObjs = helpers.formatDataForSheet(data)
          // console.log(arrayDateObjs)

          // sheet.getRows({limit: 20, offset: 1}, (err,rows) => {
          //   console.log(rows)
          //   if(rows.length > 0){
          //     rows.forEach((row) => {
          //       row.del((err, success) => {
          //         if(err) throw err
          //         module.exports.deletePreviousCells()
          //       })
          //     })
          //   } else {
          //     console.log('There aren\' any rows!')
          //   }
          // })

          // arrayDateObjs.forEach(el => {
            // sheet.addRow(el, (err,row) => {
            //   if(err){
            //     throw err
            //     // console.log(row)
            //   }
            // })
            // })

            // sheet.getCells({'min-row': 2, 'max-row' : (arrayDateObjs.length + 1),'min-col' : 1, 'max-col': 7, 'return-empty' : true}, (err, cells) => {
            //   for(let i = 0; i < (arrayDateObjs.length * 7); i++){
            //     cells[i].value = arrayDateObjs[cells[i].row - 2][cells[i].col - 1]
            //   }
            //   sheet.bulkUpdateCells(cells)
            // })
            
        })
      }
    })
  }
}