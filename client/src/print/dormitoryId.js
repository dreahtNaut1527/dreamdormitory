import html2canvas from 'html2canvas'

function printDormitoryID(elementID) {
    let pdfMake = require('pdfmake/build/pdfmake.js')
    if (pdfMake.vfs == undefined){
      let pdfFonts = require('pdfmake/build/vfs_fonts.js')
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    const element = document.getElementById(elementID)
    html2canvas(element, { allowTaint: true, useCORS: true, scale: 5 }).then(canvas => {
        let data = canvas.toDataURL()
        let docDefinition = {
            pageMargins: [10, 10, 0, 0],
            pageSize: 'A4',
            pageOrientation: 'landscape',   
            content: [{
                image: data,
                width: 780,
            }]
        }
        window.open(pdfMake.createPdf(docDefinition).open(), '_blank')
    })
}

export default printDormitoryID