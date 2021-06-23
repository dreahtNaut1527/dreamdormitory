<template>
    <v-dialog v-model="dialog" width="500"  heigth="800" persistent>
        <v-card>
            <v-toolbar color="primary" dark dense hide-details>
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
                                dense 
                                hide-details 
                                outlined
                                label="Year"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2" sm="2">
                            <v-text-field
                                type="number"
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
                <v-btn @click="dialog=!dialog"><v-icon left> mdi-close </v-icon> Close</v-btn>
                <v-btn 
                    :color="themeColor == '' ? '#1976d2' : themeColor"
                    :disabled="disableprocess"
                    :dark="!disableprocess"
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
        this.dialog=this.setcutoffdialog
        
    },
    methods:{
        enableprocess(){
            this.disableprocess= !this.valid
        }
    }

}
</script>
 