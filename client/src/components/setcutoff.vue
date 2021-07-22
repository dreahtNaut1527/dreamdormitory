<template>
    <modal name="cutoff" :adaptive="true" :draggable="true" :focusTrap="true" :reset="true" height="auto">
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
                <v-btn class="px-5" @click="clearVariables()" text>Cancel</v-btn>
                <v-btn 
                    :color="themeColor == '' ? '#1976d2' : themeColor"
                    :disabled="disableprocess"
                    :dark="!disableprocess"
                    @click="processNewCutOffDate()"
                >
                    <v-icon left>mdi-calendar-blank</v-icon> 
                    Rental Transaction
                </v-btn>
            </v-card-actions>
        </v-card>
    </modal>
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
        this.clearVariables()
    },
    methods:{
        enableprocess() {
            this.disableprocess = !this.valid
        },
        processNewCutOffDate() {
            let dtconsumptionstart = null
            let dtconsumptionend = null
            let lastPaydate = `${this.year}-${this.selectedmonth}-15`
            
            if (this.cutoff == 2) {
                lastPaydate = this.moment(lastPaydate).endOf('month').format('YYYY-MM-DD')
                dtconsumptionstart = this.moment(`${this.year}-${this.selectedmonth}-06`).format('YYYY-MM-DD')
                dtconsumptionend = this.moment(`${this.year}-${this.selectedmonth}-20`).format('YYYY-MM-DD')
            } else {                
                dtconsumptionstart = this.moment(`${this.year}-${this.selectedmonth}-21`).add(-1,'months').format('YYYY-MM-DD')
                dtconsumptionend = this.moment(`${this.year}-${this.selectedmonth}-05`).format('YYYY-MM-DD')
            }  

            let body = {
                procedureName: 'ProcSetNewPayrollDate',
                values: [
                    lastPaydate
                ]
            }
            this.handleQuestionMessage('', 'Set new payroll transaction?', 'Yes', 'No', 'question').then(result => {
                if(result.isConfirmed) {
                    this.axios.post(`${this.api}/executeselect`, {data: JSON.stringify(body)}).then(res => {
                        let result = res.data[0]
                        if(result.ErrCode == '203' || result.ErrCode == '200') {
                            this.$store.commit('CHANGE_PAYROLLDATE', lastPaydate)
                            this.$store.commit('CHANGE_CUTOFFDATE', [dtconsumptionstart, dtconsumptionend])
                            this.processRental(lastPaydate, dtconsumptionstart, dtconsumptionend)
                        } else {
                            if(result.ErrCode == '201') {
                                this.$store.commit('CHANGE_PAYROLLDATE', lastPaydate)
                                this.$store.commit('CHANGE_CUTOFFDATE', [dtconsumptionstart, dtconsumptionend])
                                this.handleConfimedMessage('', 'Cut-Off already processed', 'info')
                            }else {
                                this.handleConfimedMessage('', 'Cut-Off must be processed', 'error')
                            }
                        }
                    })
                } else if(result.isDenied) {
                    this.$store.commit('CHANGE_PAYROLLDATE', lastPaydate)
                    this.$store.commit('CHANGE_CUTOFFDATE', [dtconsumptionstart, dtconsumptionend])
                }
                this.dialog = !this.dialog
                window.location.reload()
            })
        },
        processRental(lastPaydate, dtconsumptionstart, dtconsumptionend) {
            let body = {
                procedureName: 'ProcRentalTransaction',
                values:[
                    lastPaydate,
                    this.hrisUserInfo.USERACCT
                ]
            }
            this.axios.post(`${this.api}/executeselect`,{data: JSON.stringify(body)}).then(() => {
                this.processConsumption(lastPaydate, dtconsumptionstart, dtconsumptionend)
            })
        },
        processConsumption(lastPaydate, dtconsumptionstart, dtconsumptionend) {        
            let body = {
                procedureName: 'ProcConsumptionTransaction',
                values: [
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
            this.axios.post(`${this.api}/executeselect`,{data: JSON.stringify(body)})
            this.$store.commit('CHANGE_PAYROLLDATE', lastPaydate)
            this.$store.commit('CHANGE_CUTOFFDATE', [dtconsumptionstart, dtconsumptionend])
            this.dialog = !this.dialog
            this.clearVariables()
            this.$refs.form.resetValidation()
        } ,
        clearVariables() {
            this.valid = true
            this.dialog = false
            this.selectedmonth = this.moment().format('MM')
            this.year = this.moment().format('YYYY')
            this.cutoff = ""
            this.disableprocess = true
            this.$modal.hide('cutoff')
        }
        
    },
    watch: {
        setcutoffdialog() {
            this.dialog = true
            this.$modal.show('cutoff')
        }
    }

}
</script>
 