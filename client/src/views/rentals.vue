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
                <v-container fluid>
                    <v-row align= 'center' justify='center'>
                         <v-col cols='12' md='3' sm='3'>
                            <v-autocomplete
                                dense
                                hide-details
                                outlined
                                v-model="company"
                                label="Company"
                                :items="companyList"
                            >   
                            </v-autocomplete>
                        </v-col>                       
                        <v-col cols='12' md='3' sm='3'>
                            <v-autocomplete
                                dense
                                hide-details
                                outlined
                                v-model="building"
                                label="Building"
                                :items="buildingList"
                            >   
                            </v-autocomplete>
                        </v-col>
                        <v-col cols='12' md='3' sm='3'>
                            <v-autocomplete 
                                dense
                                hide-details
                                outlined
                                v-model="floor"
                                label="Floors"
                                :items="floorList"
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='12' md='3' sm='3'>
                            <v-autocomplete 
                                dense
                                hide-details
                                outlined
                                v-model="room"
                                label="Rooms"
                                :items="roomList"
                            ></v-autocomplete>
                        </v-col>                    
                    </v-row>
                </v-container> 
            </v-card>
        </v-container>
        <v-container fluid>
            <v-card outlined>                
                <v-container fluid>
                    <v-data-table
                        :headers="headers"
                        :items="filterRentals"
                        hide-default-footer
                        :page.sync='page'
                        @page-count="pageCount = $event"
                        loading-text="Loading Data. Please Wait..."                        
                    >   
                        <template v-slot:[`item.Actions`] = '{ item }'>
                            <v-btn @click="viewRentalDetails(item)" dark small fab :color="themeColor == '' ? '#1976d2' : themeColor">
                                <v-icon>mdi-eye-outline</v-icon>
                            </v-btn>
                        </template>
                        <template v-slot:footer>
                            <v-card flat outlined>
                                <v-card-text class="caption text-subtitle-1 font-weight-bold">
                                    <span>Total Record(s): </span>
                                    <span class="mx-3">{{totalRecords}}</span>
                                </v-card-text>
                            </v-card>
                        </template>
                    </v-data-table> 
                    <v-pagination
                        v-model="page"
                        :length="pageCount"
                        :total-visible="10"
                        :color="themeColor == '' ? '#1976d2' : themeColor"
                    ></v-pagination>
                </v-container>
            </v-card>
        </v-container>
        <v-dialog 
            v-model="dialog"
            width="800"
        >
            <v-card >
                <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor"  dark>
                    <v-toolbar-title>Rental Details</v-toolbar-title>
                </v-toolbar>
                <v-container fluid>
                    <v-row dense >
                        <v-col dense cols="12" md="6" sm="6">
                            <v-card
                                max-width="400"
                                class="mx-auto"
                            >              
                                <v-list two-line>
                                    <v-list-item>
                                        <v-list-item-avatar
                                            size="80"
                                            tile
                                        >
                                        <img :src="!viewRentals.EmployeeCode ? '' : `${photo}/${viewRentals.EmployeeCode}.jpg`"
                                        >
                                        </v-list-item-avatar>                                        
                                        <v-list-item-content>
                                            <v-list-item-title>{{viewRentals.EmployeeCode}}  {{viewRentals.EmployeeName}}</v-list-item-title>
                                            <v-list-item-subtitle>{{viewRentals.Department}}</v-list-item-subtitle>
                                            <v-list-item-subtitle>{{viewRentals.Section}}</v-list-item-subtitle>
                                            <v-list-item-subtitle>{{viewRentals.Team}}</v-list-item-subtitle>
                                            <v-list-item-subtitle>{{viewRentals.Company}}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-divider ></v-divider>

                                    <v-list-item>
                                        <v-list-item-icon>
                                        <v-icon color="indigo">
                                            mdi-domain
                                        </v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-content>
                                        <v-list-item-title>{{viewRentals.BuildingDesc}}</v-list-item-title>
                                        <v-list-item-subtitle>Building</v-list-item-subtitle>
                                        </v-list-item-content>        
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="indigo">
                                                mdi-stairs
                                            </v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>{{viewRentals.FloorDesc}}</v-list-item-title>
                                            <v-list-item-subtitle>Floor</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item dense>
                                        <v-list-item-icon>
                                            <v-icon color="indigo">
                                                mdi-bed-empty
                                            </v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>{{viewRentals.RoomDesc}}</v-list-item-title>
                                            <v-list-item-subtitle>Room</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                        <v-col dense cols="12" md="6" sm="6">
                            <v-card     
                                max-width="400"
                                class="mx-auto"
                                height="100%"
                            >
                                <v-container fluid  >
                                    <v-data-table 
                                        :headers="detailsHeader" 
                                        :items="rentalsDetails"
                                        hide-default-footer
                                    >
                                    </v-data-table>
                                <v-card  flat class="mt-16">
                                    <v-divider></v-divider> 
                                    <v-container fluid>
                                        <v-card-actions>
                                            <span style="font-weight:bold">Total Amount :</span>
                                            <v-spacer></v-spacer>                
                                            <span style="margin-left:10px">{{totalAmount}}</span>
                                        </v-card-actions>                                    
                                    </v-container>
                                </v-card>     
                                </v-container> 
                            </v-card>                                        
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-model="loadingdialog" width="400" height="100%">
            <v-card 
                class="text-center"
                height
            >
                <v-container>
                    <v-progress-circular
                        :rotate="0"
                        :size="100"
                        :color="themeColor == '' ? '#1976d2' : themeColor"
                        :value="percentVal"
                        indeterminate
                        width="15"                        
                    >
                        {{percentVal}}
                    </v-progress-circular>
                </v-container>
                <v-divider></v-divider>
                <v-card-text class="text-center">Sending. Please wait...</v-card-text>
            </v-card>
            
        </v-dialog>
        {{sendFlag}}
        <v-fab-transition v-if="sendFlag.length == 0">
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                        :color="themeColor == '' ? '#1976d2' : themeColor"
                        v-bind="attrs"
                        v-on="on"
                        right
                        bottom
                        fixed
                        fab
                        dark
                        @click="SendRentalBillings()"
                    >
                        <v-icon>mdi-upload-multiple</v-icon>
                    </v-btn>
                </template>
                <span>
                    Send
                </span>
            </v-tooltip>

        </v-fab-transition>
    </v-main>
</template>

<script> 

export default {   
    data() {
        return {
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Rentals', disabled: true, href: '#'}
            ],
            headers:[
                {text:'EmployeeCode', value:'EmployeeCode'},
                {text:'Name', value:'EmployeeName'},
                {text:'Department', value:'Department'},
                {text:'Section', value:'Section'},
                {text:'Team', value:'Team'},
                {text:'TotalAmount', value:'TotalAmount'},
                {text: 'Actions', value: 'Actions' },
                
            ],
            detailsHeader:[
                {text:'Payroll Code',value:'XCode'},
                {text:'Description',value:'Description'},
                {text:'Amount',value:'Amount'},
            ],
            viewRentals:{
                BuildingDesc: "",
                BuildingId: "",
                Company: "",
                CompanyCode:"",
                Department:"",
                Description: "",
                EmployeeCode: "",
                FloorDesc: "",
                FloorNo: "",
                PayrollDate: null,
                RoomDesc: "",
                RoomNo: "",
                Section:"",
                SerialNo: "",
                Team:"",
                TotalAmount: ""
            },
            rentalsTotal:[],
            rentalsDetails:[],          
            setcutoffdialog:false,
            dialog:false,
            building:'',
            floor:'',
            room:'',
            company:'',
            page:1,
            pageCount:0,
            totalAmount:0,
            loadingdialog:false,
            value:0,
            interval:{},
            percentVal:0,
            sendFlag:{},
            
        }
    },
    async created() {
        // this.setcutoffdialog=!this.setcutoffdialog
        // this.loadRentals()
        await this.loadRentatTotal()
    },
    computed:{
        filterRentals(){
            return this.rentalsTotal.filter(rec =>{
                return (
                    rec.BuildingDesc.includes(this.building || '') &&
                    rec.FloorDesc.includes(this.floor ||'') &&
                    rec.RoomDesc.includes(this.room || '') &&
                    rec.Company.includes(this.company || '')
                )
            })
        },
        buildingList(){
            return this.filterRentals.map(rec => {
                return rec.BuildingDesc
            }).sort()
        },
        floorList(){
            return this.filterRentals.map(rec =>{
                return rec.FloorDesc
            }).sort()
        },
        roomList(){
            return this.filterRentals.map(rec =>{
                return rec.RoomDesc
            })
        },
        companyList(){
            return this.filterRentals.map(rec => {
                return rec.Company
            })
        },
        totalRecords(){
            return this.filterRentals.length
        },

    },
    beforeDestroy(){
        clearInterval(this.interval)
    },
    mounted (){

    },
    methods: {
        async loadRentatTotal(){
            let station=await this.handleSelectData()
             this.loadMasterMaintenance('rentalsTotal').then(res => {
                this.rentalsTotal=res.data
                this.sendFlag = this.rentalsTotal.filter(item => item.SendFlag == 1)
                if (this.rentalsTotal != []){
                    this.rentalsTotal.forEach(rec => {
                        let employee=station.filter(item => item.EMPLCODE == rec.EmployeeCode)
                        Object.assign(rec,{
                            EmployeeName: employee[0].EMPNAME || 'NONE',
                            Department: employee[0].DEPTDESC || 'NONE',
                            Section: employee[0].SECTIONDESC || 'NONE',
                            Team: employee[0].TEAMDESC || 'NONE',
                        })                         
                        this.$forceUpdate()
                    })
                }  
               
             })
        },
        viewRentalDetails(data){
            this.loadMasterMaintenance('rentalsdedatils').then(res => {
                this.rentalsDetails=res.data.filter(item  => item.EmployeeCode == data.EmployeeCode)
                this.dialog= true                
                Object.assign(this.viewRentals,data)                
                this.totalAmount=this.viewRentals.TotalAmount
            })
            
        },
        SendRentalBillings(){
            this.loadingdialog=true
            this.interval=setInterval(()=>{
                if (this.percentVal ===100) 
                    {this.loadingdialog=false
                    clearInterval(this.interval)
                    this.percentVal=0
                    return (this.value = 0)                    
                }                         
                this.value++
                this.percentVal= Math.round((100* this.value)/this.rentalsTotal.length)
            },100)   
            // let body={
            //     procedureName: '',
            // }
            // this.axios.post(`${this.api}/executeSelect`,{data: JSON.stringify(body)})        
        }
    },

}
</script>
<style scoped>
    .v-progress-circular {
    margin: 1rem;
    }
</style>