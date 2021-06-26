<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>
                    <span>Payroll Date : </span>
                    <span>{{consumptions.payrolldate}}</span>
                </v-toolbar-title>
            </v-toolbar>           
            <v-card outlined>
                <v-form>
                    <v-container fluid>
                        <v-row dense justify="center">
                                <v-col cols="12" md="3" sm="3">
                                    <v-select    
                                    v-model="selectedtype"                                 
                                    :items="itemstype"
                                    label="Type"
                                    outlined
                                    dense
                                    hide-details
                                    @change="consumptiontype()"
                                    ></v-select>
                                </v-col>
                            <v-col cols="12" md="3" sm="3">
                                    <v-autocomplete 
                                        :items="buildingList"
                                        v-model="building"
                                        outlined
                                        chip
                                        small-chips
                                        dense
                                        label="Building"
                                        hide-details 
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-autocomplete 
                                        :items="floorList"
                                        v-model="floor"
                                        outlined
                                        chip
                                        small-chips
                                        dense
                                        label="Floor"
                                        hide-details
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-autocomplete 
                                        :items="roomList"
                                        v-model="room"
                                        outlined
                                        chip
                                        small-chips
                                        dense
                                        label="Room"
                                        hide-details
                                    ></v-autocomplete>
                                </v-col> 
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>            
        </v-container>
        <v-container fluid >
            <v-card outlined>
                <v-container >
                    <v-data-table 
                        :headers="headers"
                        :items="filterConsumptions"
                        :page.sync="page"
                        loading-text="Loading Data. . .Please Wait"
                        @page-count="pagecount = $event"
                        hide-default-footer
                    >
                        <template v-slot:[`item.ConsumptionType`]='{ item }'>
                            <v-chip>{{!item.ConsumptionType ? 'Electricity' : 'Water'}}</v-chip>
                        </template>
                        <template v-slot:[`item.Actions`]='{ item }'>
                            <v-btn icon @click="editRecord(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                        </template>
                    </v-data-table>
                    <v-pagination
                        v-model="page"
                        :length="pagecount"
                        :total-visible="10"
                        :color="themeColor == '' ? '#1976d2' : themeColor"
                    ></v-pagination>
                </v-container>
            </v-card>
        </v-container>
        <v-dialog v-model="dialog" width="800">            
                <v-card>
                    <v-toolbar :color="selectedtype ==0 ? 'deep-orange accent-3' :'#0091EA'"  dark>
                        <v-toolbar-title>
                            {{selectedtype ==0 ? 'Electric Bill' : 'Water Bill'}}
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-form>
                        <v-container >
                            <v-row justify="center" align="center">
                                <v-col cols="12" md="6" sm="6">
                                    <v-card>
                                        <v-system-bar>
                                            Previous
                                        </v-system-bar>   
                                        <v-container>
                                            <v-row>
                                                <v-col cols= 12 md="4" sm="6">
                                                    <v-text-field
                                                        v-model="editConsumption.PrevReading"
                                                        dense
                                                        small
                                                        outlined
                                                        hide-details
                                                        label="Reading"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols= 12 md="8" sm="6">
                                                    <v-text-field
                                                        v-model="editConsumption.PrevBillPeriod"
                                                        dense
                                                        small
                                                        outlined
                                                        hide-details
                                                        label="Bill Period"
                                                    >
                                                    </v-text-field>
                                                </v-col>                                                
                                            </v-row>                                           
                                        </v-container>
                                    </v-card>

                                </v-col>
                                <v-col cols="12" md="6" sm="6">
                                    <v-card>
                                        <v-system-bar>
                                            Latest
                                        </v-system-bar>    
                                        <v-container>
                                            <v-row>
                                                <v-col cols= 12 md="4" sm="6">
                                                    <v-text-field
                                                        v-model="editConsumption.LatestReading"
                                                        dense
                                                        small
                                                        outlined
                                                        hide-details
                                                        label="Reading"
                                                        @blur="computeConsumption(editConsumption)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols= 12 md="8" sm="6">
                                                    <v-text-field
                                                        v-model="editConsumption.LatestBillPeriod"
                                                        dense
                                                        small
                                                        outlined
                                                        hide-details
                                                        label="Bill Period"                                                        
                                                        
                                                    >
                                                    </v-text-field>
                                                </v-col>                                                
                                            </v-row>
                                           
                                        </v-container>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-card outlined>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" md="4" sm="4">
                                                    <v-text-field
                                                        v-model="lesskwm3"
                                                        dense
                                                        small
                                                        outlined
                                                        hide-details
                                                        :label="selectedtype==0 ? 'Less free KW (fixed)' : 'Less free M3 (fixed)'"                                                
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" sm="4">
                                                    <v-text-field
                                                        v-model="editConsumption.TotalConsumption"
                                                        dense
                                                        small
                                                        outlined
                                                        hide-details
                                                        label="Consumption"                                                
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" sm="4">
                                                    <v-text-field
                                                        v-model="amountperkwm3"
                                                        dense
                                                        small
                                                        outlined
                                                        hide-details
                                                        :label="selectedtype==0 ? 'Per KW' : 'Per M3'"                                           
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="6" sm="4">
                                                    <v-text-field
                                                        v-model="editConsumption.TotalKWM3"
                                                        dense
                                                        small
                                                        outlined
                                                        hide-details
                                                        label="Amount/Room"                                               
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="6" sm="4">
                                                    <v-text-field
                                                        v-model="editConsumption.TotalAmount"
                                                        dense
                                                        small
                                                        outlined
                                                        hide-details
                                                        label="Amount/Head"                                              
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                    
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="saveConsumption()">Save</v-btn>
                        <v-btn @click="clearVariables">Close</v-btn>
                    </v-card-actions>
                </v-card>      
        </v-dialog>
        <setcutoff
            :setcutoffdialog="setcutoffdialog"
            :consumptiondetails.sync="consumptions"
            :payrolldate.sync="payrollDate"
        >
        </setcutoff>
    
    </v-main>
</template>

<script>
import setcutoff from "../components/setcutoff.vue";
export default {
    data() {
        return {
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Consumption', disabled: true, href: '#'}
            ],
            headers:[
                {text:'Buiding',value:'BuildingDesc'},
                {text:'Floor',value:'FloorDesc'},
                {text:'Room',value:'RoomDesc'},
                {text:'Payroll Date',value:'PayrollDate'},
                {text:'Previous Reading',value:'PrevReading'},
                {text:'Latest Reading',value:'LatestReading'},                
                {text:'Consumption Type',value:'ConsumptionType'},                
                {text:'Total tenants',value:'TotalTenants'},                
                {text:'Consumption',value:'TotalConsumption'},
                {text:'Amount/Room',value:'TotalKWM3'},
                {text:'Amount/Head',value:'TotalConsumption'},
                {text:'Actions',value:'Actions'},
            ],
            itemstype:[
                {text:'Electricity',value:0},
                {text:'Water',value:1}
            ],
            editConsumption:{  
                    SerialNo:'',             	
                    Building:'',
                    Floor:'',
                    Room:'',
                    ConsumptionType:'',
                    StartDate:null,
                    EndDate:null,
                    PayrollDate:null,
                    PrevReading:0,
                    LatestReading:0,
                    TotalTenants:0,
                    TotalConsumption:0,
                    TotalKWM3:0,
                    TotalAmount:0,
            },
            dialog:false,
            consumptions:[],
            selectedtype:0,            
            page:1,
            pagecount:0,
            loading:false,
            cubickilowatt:"",
            building:"",
            room:"",
            floor:"",
            setcutoffdialog:false,
            amountperkwm3:12.50,
            lesskwm3:0,
            payrollDate:''
        }
    },
    created() {
        this.consumptiontype()
        this.setcutoffdialog=!this.setcutoffdialog
    },

    computed:{
        filterConsumptions(){
            return this.consumptions.filter(rec => {
                return(
                    rec.BuildingDesc.includes(this.building || '') &&
                    rec.ConsumptionType==this.selectedtype && 
                    rec.FloorDesc.includes(this.floor|| '') &&
                    rec.RoomDesc.includes(this.room || '')
                )
            })
        },
        buildingList(){
            return this.filterConsumptions.map(rec => {
                return rec.BuildingDesc
            }).sort()
        },
        floorList(){
            return this.filterConsumptions.map(rec => {
                return rec.FloorDesc
            }).sort()
        },
        roomList(){
            return this.filterConsumptions.map(rec => {
                return rec.RoomDesc
            })
        }
    },
    methods: {
        consumptiontype(){
            this.cubickilowatt=this.selectedtype
        },
        editRecord(data){
            this.actionMode=1
            this.dialog=true
            Object.assign(this.editConsumption,data)
            if (data.ConsumptionType==0){
                this.lesskwm3=80
            }else{
                this.lesskwm3=10
            }

        },
        computeConsumption(val){
            val.TotalConsumption=val.LatestReading - val.PrevReading
            val.TotalKWM3=(val.TotalConsumption - this.lesskwm3) * this.amountperkwm3
            val.TotalAmount=val.TotalKWM3 / val.TotalTenants
            this.$forceUpdate()
        },
        saveConsumption(){
            let body={
            procedureName: 'ProcConsumptionTransaction',
            values:[
                this.editConsumption.SerialNo,
                this.editConsumption.PayrollDate,
                this.editConsumption.ConsumptionType,
                this.editConsumption.ConsumptionStartDate,
                this.editConsumption.ConsumptionEndDate,
                this.editConsumption.LatestReading,
                this.editConsumption.TotalConsumption,
                this.editConsumption.TotalKWM3,
                this.editConsumption.TotalAmount,
                this.hrisUserInfo.USERACCT,
                1,
            ]
            }
            console.log(body);
            this.axios.post(`${this.api}/executeselect`,{data: JSON.stringify(body)}).then(res => {
                this.$emit('update:consumptiondetails',res.data)
                console.log(res.data);
                this.consumptions=[]
                this.consumptions=res.data
                console.log(this.consumptions);
                this.clearVariables()
               
            })
        },
        clearVariables(){
            this.dialog=false
            this.editConsumption={                	
                    Building:'',
                    Floor:'',
                    Room:'',
                    ConsumptionType:'',
                    StartDate:null,
                    EndDate:null,
                    PayrollDate:null,
                    PrevReading:0,
                    LatestReading:0,
                    TotalTenants:0,
                    TotalConsumption:0,
                    TotalKWM3:0,
                    TotalAmount:0
                    
            }
        }
    },
        components:{
        setcutoff
    }
}
</script>