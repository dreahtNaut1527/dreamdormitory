<template>
    <v-dialog v-model="dialog" width="500"  heigth="800" persistent>
        <v-card>
            <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark dense hide-details>
                <span>Set Payroll Cut-off</span>
            </v-toolbar>
            
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-container fluid>
                    <div style="padding:10px;border-style:solid;border-width:1px">
                    <v-row dense>
                        <v-col cols="12" md="6" sm="6">
                            <v-autocomplete 
                                v-model="selectedmonth"
                                :items="getMonth()"
                                :color="themeColor == '' ? '#1976d2' : themeColor"
                                item-text="text"
                                item-value="value"
                                dense 
                                hide-details 
                                outlined
                                label="Month"
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4" sm="4">
                            <v-text-field 
                                v-model="year"
                                :color="themeColor == '' ? '#1976d2' : themeColor"
                                dense 
                                hide-details 
                                outlined
                                label="Year"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2" sm="2">
                            <v-text-field
                                type="number"
                                :color="themeColor == '' ? '#1976d2' : themeColor"
                                v-model="cutoff"
                                outlined
                                dense 
                                hide-details
                                :rules="cutoffrule"
                                required
                                @change="enableprocess()"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    </div>
                </v-container>
            </v-form>
            
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="px-5" @click="dialog = !dialog" text>Cancel</v-btn>
                <v-btn 
                    :color="themeColor == '' ? '#1976d2' : themeColor"
                    :disabled="disableprocess"
                    :dark="!disableprocess"
                    @click="processRental()"
                >
                    <v-icon left>mdi-calendar-blank</v-icon> 
                    Rental Transaction
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>
<script>

export default {
    props:['setcutoffdialog'],
    data(){
        return {
            cutoffrule:[
                v=>!!v || 'Cutoff is required',
                v=>(v && (v==1 || v==2)) || ' Select 1/2 - [1] First Half  OR  [2] - Second Half'
            ],
            valid:true,
            dialog:false,
            selectedmonth:this.moment().format('MM'),
            year:this.moment().format('YYYY'),
            cutoff:"",
            disableprocess:true

        }
    },
    created(){
        this.dialog = this.setcutoffdialog
    },
    methods:{
        enableprocess(){
            this.disableprocess= !this.valid
        },
        processRental(){
            let lastPaydate=`${this.year}-${this.selectedmonth}-15`
            let dtconsumptionstart =null
            let dtconsumptionend = null
            // let histpayrolldate =null
            if (this.cutoff==2){
                lastPaydate=this.moment(lastPaydate).endOf('month').format('YYYY-MM-DD')
                dtconsumptionstart =this.moment(`${this.year}-${this.selectedmonth}-06`).format('YYYY-MM-DD')
                dtconsumptionend =this.moment(`${this.year}-${this.selectedmonth}-20`).format('YYYY-MM-DD')
            }else{                
                dtconsumptionstart =this.moment(`${this.year}-${this.selectedmonth}-21`).add(-1,'months').format('YYYY-MM-DD')
                dtconsumptionend =this.moment(`${this.year}-${this.selectedmonth}-05`).format('YYYY-MM-DD')
            }  
            // this.loadMasterMaintenance('rentals').then(res => {
            //     histpayrolldate =res.data.maxPaydate
            // })
            // //   console.log(histpayrolldate);   
            let body={
                procedureName: 'ProcRentalTransaction',
                values:[
                    lastPaydate,
                    this.hrisUserInfo.USERACCT
                ]
            }
            // this.axios.post(`${this.api}/executeselect`,{data: JSON.stringify(body)}).then(res => {
            //     // console.log(res.data);
            //     this.$emit('update:rentals',res.data)
            //     this.dialog=false
            // })
            this.axios.post(`${this.api}/executeselect`,{data: JSON.stringify(body)})
            this.processConsumption(lastPaydate,dtconsumptionstart,dtconsumptionend)
        },
        processConsumption(lastPaydate,dtconsumptionstart,dtconsumptionend){        
            let body={
            procedureName: 'ProcConsumptionTransaction',
            values:[
                null,
                this.moment(lastPaydate).format('YYYY-MM-DD'),
                0,
                this.moment(dtconsumptionstart).format('YYYY-MM-DD'),
                this.moment(dtconsumptionend).format('YYYY-MM-DD'),
                0,
                0,
                0,
                0,
                this.hrisUserInfo.USERACCT,
                0,
            ]
            }
            // console.log(body);
            // this.axios.post(`${this.api}/executeselect`,{data: JSON.stringify(body)}).then(res => {
            //     console.log(res.data);
            //     this.$emit('update:consumptiondetails',res.data)
            //     this.$emit('update:payrolldate',this.moment(lastPaydate).format('LL'))
            //     this.dialog=false
            // })
            this.axios.post(`${this.api}/executeselect`,{data: JSON.stringify(body)})
            this.$store.commit('CHANGE_PAYROLLDATE', lastPaydate)
            this.$store.commit('CHANGE_CUTOFFDATE', [dtconsumptionstart, dtconsumptionend])
            this.dialog = !this.dialog
        } 
        
    },
    watch: {
        setcutoffdialog() {
            this.dialog = true
        }
    }

}
</script>
 