// import moment from 'moment'
import imageToBase64 from 'image-to-base64/browser'

function printDormitoryID(data, photo) {
    let employeePhoto = null
    let docDefinition = {}
    let docContent = []
    let pdfMake = require('pdfmake/build/pdfmake.js')
    if (pdfMake.vfs == undefined){
      let pdfFonts = require('pdfmake/build/vfs_fonts.js')
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    data.forEach((rec, index) => {
        imageToBase64(`${photo}/${rec.EmployeeCode}.jpg`).then(rec => {
            employeePhoto = `data:image/jpeg;base64,${rec}`

            docContent.push(
                {
                    text: 'DREAM DORMITORY PASS', 
                    headlineLevel: 1, 
                    bold: true,
                    fontSize: 16,
                    alignment: 'center',
                    margin: [0, 0, 0, 0],
                },
                {
                    image: employeePhoto,
                    width: 80,
                    height: 80,
                    margin: [0, 50, 0, 0]
                }
            )
            
            if(index == data.length - 1) {
                docDefinition = { 
                    font: 'tahoma',
                    pageSize: 'A4',
                    pageOrientation: 'landscape',
                    pageMargins: [80, 0, 80, 0],
                    content: docContent
                }    
                window.open(pdfMake.createPdf(docDefinition).open(), '_blank')
            }
        })
    })

}

export default printDormitoryID