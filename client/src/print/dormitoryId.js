// import moment from 'moment'
// import imageToBase64 from 'image-to-base64/browser'

function printDormitoryID(data, photo) {
    console.log(data, photo);
    // let counter = 1
    // let employeePhoto = null
    let docDefinition = {}
    let docContent = []
    // let tableBodyContent = []
    // let tableBodyDetailsContent = []
    let pdfMake = require('pdfmake/build/pdfmake.js')
    if (pdfMake.vfs == undefined){
      let pdfFonts = require('pdfmake/build/vfs_fonts.js')
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    // data.forEach((rec, index) => {
    //     imageToBase64(`${photo}/${rec.EmployeeCode}.jpg`).then(rec => {
    //         employeePhoto = `data:image/jpeg;base64,${rec}`
            
    //         if(counter == 3) {

    //             tableBodyDetailsContent.push(
    //                 {
    //                     stack: [
    //                         {
    //                             text: 'DREAM DORMITORY PASS', 
    //                             headlineLevel: 1, 
    //                             bold: true,
    //                             fontSize: 16,
    //                             alignment: 'center',
    //                             margin: [0, 0, 0, 0],
    //                         },
    //                         {
    //                             image: employeePhoto,
    //                             width: 80,
    //                             height: 80,
    //                             margin: [80, 30, 0, 0]
    //                         }
    //                     ]
    //                 },
    //                 [
                        
    //                     {
    //                         text: 'This is the back page', 
    //                         headlineLevel: 1, 
    //                         bold: true,
    //                         fontSize: 16,
    //                         alignment: 'center',
    //                         margin: [0, 0, 0, 0],
    //                     },
    //                 ]
    //             )

    //             tableBodyContent.push(tableBodyDetailsContent)
    //             tableBodyDetailsContent = []
    //             counter = 1
    //         } else {

    //             tableBodyDetailsContent.push(
    //                 {
    //                     stack: [
    //                         {
    //                             text: 'DREAM DORMITORY PASS', 
    //                             headlineLevel: 1, 
    //                             bold: true,
    //                             fontSize: 16,
    //                             alignment: 'center',
    //                             margin: [0, 0, 0, 0],
    //                         },
    //                         {
    //                             image: employeePhoto,
    //                             width: 80,
    //                             height: 80,
    //                             margin: [80, 30, 0, 0]
    //                         }
    //                     ]
    //                 },
    //                 [
                        
    //                     {
    //                         text: 'This is the back page', 
    //                         headlineLevel: 1, 
    //                         bold: true,
    //                         fontSize: 16,
    //                         alignment: 'center',
    //                         margin: [0, 0, 0, 0],
    //                     },
    //                 ]
    //             )

    //             counter++
    //         }
            
    //         // Final Row
    //         if(index + 1 == data.length) {
    //             tableBodyContent.push(tableBodyDetailsContent)
    //             console.log(tableBodyContent);
    //             docContent.push(
    //                 {
    //                     table: {
    //                         body: [
    //                             tableBodyContent
    //                         ]
    //                     }
    //                 },
    //             )
    //             docDefinition = { 
    //                 font: 'tahoma',
    //                 pageSize: 'A4',
    //                 pageOrientation: 'landscape',
    //                 pageMargins: [80, 60, 80, 0],
    //                 content: docContent,    
    //                 styles: {
    //                     tableHeader: {
    //                         bold: true,
    //                         fontSize: 13,
    //                         color: 'black'
    //                     }
    //                 }
    //             }    
    //             window.open(pdfMake.createPdf(docDefinition).open(), '_blank')
    //         }
    //     })
    // })

    docContent = {
        table: {
            body: [
                [
                    {
                        table: {
                            body: [
                                [
                                    {
                                        stack: [
                                            {text: 'front'}
                                        ]
                                    },
                                    {
                                        stack: [
                                            {text: 'back'}
                                        ]
                                    }
                                ]
                            ]
                        },
                    },
                    {
                        table: {
                            body: [
                                [
                                    {
                                        stack: [
                                            {text: 'front'}
                                        ]
                                    },
                                    {
                                        stack: [
                                            {text: 'back'}
                                        ]
                                    }
                                ]
                            ]
                        }
                    },
                    {
                        table: {
                            body: [
                                [
                                    {
                                        stack: [
                                            {text: 'front'}
                                        ]
                                    },
                                    {
                                        stack: [
                                            {text: 'back'}
                                        ]
                                    }
                                ]
                            ]
                        }
                    },
                ],
                ['front', 'back', 'front'], // new row
                ['front', 'back', 'front'], // new row
            ]
        }
    }
    docDefinition = { 
        font: 'tahoma',
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [80, 60, 80, 0],
        content: docContent,    
        styles: {
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        }
    }    
    window.open(pdfMake.createPdf(docDefinition).open(), '_blank')

}

export default printDormitoryID