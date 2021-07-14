function reportBillingReceipt(dataCurrent,dataTenants,type){
    let reportHeader=''
    let reportDetails=''
    let reportFooter=''
    let recordCOUNT=0
    reportHeader=` <tr height=18 style='height:13.5pt'>
        <td height=18 class=xl26 colspan=2 width=143 style='height:13.5pt;mso-ignore:colspan;width:108pt'>DREAM DORMITORY</td>
        <td class=xl25 width=72 style='width:54pt'></td>
        <td class=xl25 width=72 style='width:54pt'></td>
        <td class=xl25 width=91 style='width:68pt'></td>
        <td class=xl25 width=72 style='width:54pt'></td>
        <td class=xl25 width=72 style='width:54pt'></td>
        <td class=xl25 width=72 style='width:54pt'></td>
        <td class=xl25 width=72 style='width:54pt'></td>
        <td class=xl25 width=72 style='width:54pt'></td>
        <td class=xl25 width=72 style='width:54pt'></td>
   </tr>`
    dataTenants.forEach(rec => {
        reportHeader +=  "<tr height=18 style='height:13.5pt'>"
            if (recordCOUNT==0){
                reportHeader +=   `<td height=18 colspan=6 class=xl25 style='height:13.5pt;mso-ignore:colspan'></td>
                                   <td class=xl25>TENANTS:</td>`
            }
            else if(recordCOUNT==1){
               reportHeader += `<td height=18 class=xl25 style='height:13.5pt'></td>
                                <td class=xl25>BUILDING:</td>
                                <td class=xl24>${dataTenants.BuildingDesc}</td>
                                <td colspan=4 class=xl25 style='mso-ignore:colspan'></td>`
            }
            else if(recordCOUNT==2){
               reportHeader += `<td height=18 class=xl25 style='height:13.5pt'></td>
                                <td class=xl25>ROOM:</td>
                                <td class=xl24 x:num>${dataCurrent.RoomDesc}</td>
                                <td colspan=4 class=xl25 style='mso-ignore:colspan'></td>`
            }
            else{
               reportHeader += `<td height=18 class=xl25 style='height:13.5pt'></td>
                                <td class=xl25>CUT OFF</td>
                                <td colspan=4 class=xl24>${dataTenants.CutOff}</td>
                                <td class=xl25></td>`
            }
            reportHeader += `<td colspan=4 class=xl27>2129699 - ${dataTenants.EmployeeName}</td>`
        reportHeader += "<\tr>"
    });
    reportHeader += `<tr height=18 style='height:13.5pt'>
         <td height=18 colspan=7 class=xl25 style='height:13.5pt;mso-ignore:colspan'></td>
         <td class=xl28>&#12288;</td>
         <td class=xl28>&#12288;</td>
         <td class=xl28>&#12288;</td>
         <td class=xl28>&#12288;</td>
   </tr>
   <tr height=23 style='mso-height-source:userset;height:17.25pt'>
         <td colspan=11 height=23 class=xl29 style='height:17.25pt'>ELECTRIC BILL</td>
   </tr>
   <tr height=18 style='height:13.5pt'>
         <td height=18 colspan=11 class=xl25 style='height:13.5pt;mso-ignore:colspan'></td>
  </tr>
  <tr height=18 style='height:13.5pt'>
        <td height=18 colspan=11 class=xl25 style='height:13.5pt;mso-ignore:colspan'></td>
  </tr>`
// 
   reportDetails = `<tr height=18 style='height:13.5pt'>
        <td height=18 class=xl26 colspan=2 style='height:13.5pt;mso-ignore:colspan'>SUMMARY</td>
        <td colspan=9 class=xl25 style='mso-ignore:colspan'></td>
  </tr>
  <tr height=18 style='height:13.5pt'>
        <td colspan=4 height=18 class=xl30 style='height:13.5pt'>Meter Reading</td>
        <td rowspan=2 class=xl30>Consumption</td>
        <td colspan=2 rowspan=2 class=xl31 width=144 style='width:108pt'>Less free   80KW (fixed)</td>
        <td colspan=2 rowspan=2 class=xl31 width=144 style='width:108pt'>Total KW</td>
        <td colspan=2 rowspan=2 class=xl31 width=144 style='width:108pt'>Total Amount   (12.50/KW</td>
  </tr>
  <tr height=18 style='height:13.5pt'>
        <td colspan=2 height=18 class=xl30 style='height:13.5pt'>Start</td>
        <td colspan=2 class=xl30 style='border-left:none'>End</td>
  </tr>
  <tr height=18 style='height:13.5pt'>
       <td colspan=2 rowspan=2 height=36 class=xl32 style='border-right:.5pt solid black;border-bottom:.5pt solid black;height:27.0pt'>${dataCurrent.Start}</td>
       <td colspan=2 rowspan=2 class=xl32 style='border-right:.5pt solid black;border-bottom:.5pt solid black'>${dataCurrent.End}</td>
       <td rowspan=2 class=xl34 style='border-top:none'>${dataCurrent.TotalConsumption}</td>
       <td colspan=2 rowspan=2 class=xl32 style='border-right:.5pt solid black;border-bottom:.5pt solid black'>80</td>
       <td colspan=2 rowspan=2 class=xl32 style='border-right:.5pt solid black;border-bottom:.5pt solid black'>${dataCurrent.TotalKWM3}</td>
       <td colspan=2 rowspan=2 class=xl32 style='border-right:.5pt solid black;border-bottom:.5pt solid black'>${dataCurrent.TotalAmount}</td>
  </tr>
  <tr height=18 style='height:13.5pt'>
  </tr>
  <tr height=18 style='height:13.5pt'>
      <td height=18 colspan=11 class=xl25 style='height:13.5pt;mso-ignore:colspan'></td>
  </tr>
  <tr height=18 style='height:13.5pt'>
      <td height=18 colspan=11 class=xl25 style='height:13.5pt;mso-ignore:colspan'></td>
  </tr>
  <tr height=18 style='height:13.5pt'>
      <td height=18 colspan=11 class=xl25 style='height:13.5pt;mso-ignore:colspan'></td>
  </tr>
  <tr height=19 style='height:14.25pt'>
   <td height=19 colspan=11 class=xl25 style='height:14.25pt;mso-ignore:colspan'></td>
  </tr>
  <tr height=18 style='height:13.5pt'>
   <td height=18 colspan=11 class=xl25 style='height:13.5pt;mso-ignore:colspan'></td>
  </tr>
  <tr height=18 style='height:13.5pt'>`
}
