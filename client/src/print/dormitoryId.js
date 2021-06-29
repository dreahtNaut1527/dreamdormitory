// import moment from 'moment'
import imageToBase64 from 'image-to-base64/browser'

function printDormitoryID(data, photo) {
    let docDefinition = {}
    let docContent = []
    let pdfMake = require('pdfmake/build/pdfmake.js')
    if (pdfMake.vfs == undefined){
      let pdfFonts = require('pdfmake/build/vfs_fonts.js')
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    data.forEach(rec => {
        imageToBase64(`${photo}/${rec.EmployeeCode}.jpg`).then(response => {
            docContent.push(
                {
                    text: 'DREAM DORMITORY PASS', 
                    headlineLevel: 1, 
                    bold: true,
                    fontSize: 16,
                    alignment: 'center',
                    margin: [0, 200, 0, 0],
                },
                {
                    image: `data:image/png;base64,${response}`,
                    width: 150,
                    height: 80,
                    margin: [0, -80, 0, 0]
                },
            )
        }).catch(err => {
            console.log(err);
        })
    })

    docDefinition = { 
        font: 'tahoma',
        pageSize: 'A4',
        pageMargins: [80, 0, 80, 0],
        content: docContent
    }    
    window.open(pdfMake.createPdf(docDefinition).open(), '_blank')
}

export default printDormitoryID