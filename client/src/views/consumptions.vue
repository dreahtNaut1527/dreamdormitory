<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                <v-toolbar-title>
                    <span>Payroll Date : </span>
                    <span>{{payrollDate}}</span>
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
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
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
                                        :color="themeColor == '' ? '#1976d2' : themeColor"
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
                                        :color="themeColor == '' ? '#1976d2' : themeColor"
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
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
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
        <v-container fluid>
            <v-card outlined>
                <v-container fluid>
                    <v-data-table 
                        :headers="headers"
                        :items="filterConsumptions"
                        :page.sync="page"
                        loading-text="Loading Data. . .Please Wait"
                        @page-count="pagecount = $event"
                        hide-default-footer
                        :items-per-page="9"
                    >
                        <template v-slot:[`item.RoomDesc`]='{ item }'>
                            <v-chip class="px-6">{{item.RoomDesc}} <v-icon right>mdi-bed-empty</v-icon> </v-chip>
                        </template>
                        <template v-slot:[`item.ConsumptionType`]='{ item }'>
                            <v-chip class="px-6">{{!item.ConsumptionType ? 'Electricity' : 'Water'}}<v-icon right>{{!item.ConsumptionType ? 'mdi-flash' : 'mdi-water'}}</v-icon></v-chip>
                        </template>
                        <template v-slot:[`item.Actions`]='{ item }'>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-if="item.SendFlag==0"
                                    @click="editRecord(item)" 
                                    :color="themeColor == '' ? '#1976d2' : themeColor" 
                                    v-on="on" 
                                    v-bind="attrs" 
                                    small 
                                    dark
                                    fab><v-icon>mdi-pencil</v-icon></v-btn>
                                <v-btn v-else
                                    @click="editRecord(item)" 
                                    :color="themeColor == '' ? '#1976d2' : themeColor" 
                                    v-on="on" 
                                    v-bind="attrs" 
                                    small 
                                    dark
                                    fab><v-icon>mdi-eye</v-icon></v-btn>
                                </template>
                                <span v-if="item.SendFlag==0">Edit Record</span>
                                <span v-else>View Record</span>
                            </v-tooltip>
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
        <v-dialog v-model="dialog" width="800" persistent>            
            <v-card>
                <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor"  dark>
                    <v-toolbar-title>
                        {{selectedtype ==0 ? 'Electric Bill' : 'Water Bill'}}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-icon x-large>{{selectedtype == 0 ? 'mdi-flash' : 'mdi-water'}}</v-icon>
                </v-toolbar>
                <v-card-title>
                    <v-breadcrumbs class="ml-n8 mt-n5"  :items="breadCrumbsItems2" divider="/"></v-breadcrumbs>      
                </v-card-title>
                <v-form class="mt-n5">
                    <v-container fluid>                        
                        <v-row justify="center" align="center">                        
                            <v-col cols="12" md="6" sm="6">
                                <v-card>
                                    <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                                        Previous
                                    </v-system-bar>   
                                    <v-container fluid>
                                        <v-row dense>
                                            <v-col cols= 12 md="4" sm="6">
                                                <v-text-field
                                                    v-model="editConsumption.PrevReading"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    dense
                                                    small
                                                    outlined
                                                    hide-details
                                                    filled
                                                    readonly
                                                    label="Reading"
                                                >
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols= 12 md="8" sm="6">
                                                <v-text-field
                                                    v-model="editConsumption.PrevBillPeriod"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    dense
                                                    small
                                                    outlined
                                                    hide-details
                                                    filled
                                                    readonly
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
                                    <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                                        Latest
                                    </v-system-bar>    
                                    <v-container fluid>
                                        <v-row dense>
                                            <v-col cols= 12 md="4" sm="6">
                                                <v-text-field
                                                    v-model="editConsumption.LatestReading"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    dense
                                                    small
                                                    outlined
                                                    hide-details
                                                    type="number"
                                                    label="Reading"
                                                    :readonly="!editConsumption.SendFlag==0"
                                                    :filled="!editConsumption.SendFlag==0"
                                                    @blur="computeConsumption(editConsumption)"
                                                    @change="computeConsumption(editConsumption)"
                                                >                                               
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols= 12 md="8" sm="6">
                                                <v-text-field
                                                    v-model="editConsumption.LatestBillPeriod"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    dense
                                                    small
                                                    outlined
                                                    hide-details
                                                    filled
                                                    readonly
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
                                    <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                                        Billing Results
                                    </v-system-bar>   
                                    <v-container fluid>
                                        <v-row dense>
                                            <v-col cols="12" md="4" sm="4">
                                                <v-text-field
                                                    v-model="lesskwm3"
                                                    dense
                                                    small
                                                    outlined
                                                    hide-details
                                                    filled
                                                    readonly
                                                    :label="selectedtype==0 ? 'Less free KW (fixed)' : 'Less free M3 (fixed)'"        
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"                                        
                                                >
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="4">
                                                <v-text-field
                                                    v-model="editConsumption.TotalConsumption"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    dense
                                                    small
                                                    outlined
                                                    hide-details
                                                    filled
                                                    readonly
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
                                                    filled
                                                    readonly
                                                    :label="selectedtype==0 ? 'Per KW' : 'Per M3'" 
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"                                          
                                                >
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" sm="4">
                                                <v-text-field
                                                    v-model="editConsumption.TotalKWM3"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    dense
                                                    small
                                                    outlined
                                                    hide-details
                                                    filled
                                                    readonly
                                                    label="Amount/Room"  
                                                    type='number'                                             
                                                >
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" sm="4">
                                                <v-text-field
                                                    v-model="editConsumption.TotalAmount"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    dense
                                                    small
                                                    outlined
                                                    hide-details
                                                    filled
                                                    readonly      
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
                    <v-btn class="px-5" @click="clearVariables" text>Cancel</v-btn>
                    <v-btn class="px-5" @click="saveConsumption()" :color="themeColor == '' ? '#1976d2' : themeColor" dark>Save</v-btn>
                </v-card-actions>
            </v-card>      
        </v-dialog>    
    </v-main>
</template>

<script>

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
                {text:'Amount/Head',value:'TotalAmount'},
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
                    SendDate:null,
                    SendFlag:0,
            },
            breadCrumbsItems2:[],
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
            amountperkwm3:12.50,
            lesskwm3:0,
        }
    },
    created() {
        this.consumptiontype()
        this.loadConsumption()
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
        loadConsumption(){        
            let body={
            procedureName: 'ProcConsumptionTransaction',
            values:[
                null,
                this.payrollDate,
                0,
                this.cutOffDate[0],
                this.cutOffDate[1],
                0,
                0,
                0,
                0,
                null,
                0,
            ]
            }
            console.log(body);
            this.axios.post(`${this.api}/executeselect`,{data: JSON.stringify(body)}).then(res => {
                console.log(res.data);
                this.consumptions=res.data
            })
        }, 
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
           
            this.breadCrumbsItems2.push(
                {text: data.BuildingDesc, disabled: false, href: '#'},
                {text: data.FloorDesc, disabled: false, href: '#'},
                {text: data.RoomDesc, disabled: false, href: '#'}
            )

        },
        computeConsumption(val){ 
            val.TotalConsumption=val.LatestReading - val.PrevReading           
            if (val.TotalConsumption>80) {                
                val.TotalKWM3=((val.TotalConsumption - this.lesskwm3) * this.amountperkwm3).toFixed(2)
                val.TotalAmount=(val.TotalKWM3 / val.TotalTenants).toFixed(2)
                this.$forceUpdate()
            }else{
                val.TotalConsumption=0
                val.TotalKWM3=0
                val.TotalAmount=0
            }
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
            this.breadCrumbsItems2=[]
        }
    },

}
</script>