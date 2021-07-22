import html2canvas from 'html2canvas'

function printDormitoryID(elementID) {
    let docContents = []
    let pdfMake = require('pdfmake/build/pdfmake.js')
    if (pdfMake.vfs == undefined){
      let pdfFonts = require('pdfmake/build/vfs_fonts.js')
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    elementID.forEach(async (rec, index, array) => {
        const element = document.getElementById(rec.element)
        await html2canvas(element, { allowTaint: true, useCORS: true, scale: 6}).then(canvas => {
            let data = canvas.toDataURL()
            docContents.push({
                image: data,
                width: 550
            })
        })

        if(index == array.length - 1) {
            // define document properties
            let docDefinition = {
                pageMargins: [0, 5, 0, 0],
                pageSize: 'A4',
                pageOrientation: 'portrait',   
                content: docContents
            }
            await pdfMake.createPdf(docDefinition).download('Dormitory Gate Pass.pdf')
            // console.log(docDefinition);
        }
    })

    // const element = document.getElementById(elementID)
    // await html2canvas(element, { allowTaint: true, useCORS: true, scale: 5 }).then(canvas => {
    //     let data = canvas.toDataURL()
    //     let docDefinition = {
    //         pageMargins: [0, 5, 5, 0],
    //         pageSize: 'A4',
    //         pageOrientation: 'portrait',   
    //         content: [{
    //             image: data,
    //             width: 600,
    //         }]
    //     }
    //     window.open(pdfMake.createPdf(docDefinition).open(), '_blank')
    // })
}

export default printDormitoryID