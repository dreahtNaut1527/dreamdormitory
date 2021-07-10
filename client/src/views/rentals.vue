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
                        <v-col cols='12' md='4' sm='4'>
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
                        <v-col cols='12' md='4' sm='4'>
                            <v-autocomplete 
                                dense
                                hide-details
                                outlined
                                v-model="floor"
                                label="Floors"
                                :items="floorList"
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='12' md='4' sm='4'>
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
                            <v-btn @click="viewRentalDetails(item)" icon>
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
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
                                            <v-list-item-subtitle>Rooom</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                        <v-col dense cols="12" md="6" sm="6">
                            <v-card     
                                max-width="400"
                                class="mx-auto"
                                height="100%">
                            <v-container fluid  >
                                <v-data-table 
                                    :headers="detailsHeader" 
                                    :items="rentalsDetails"
                                    hide-default-footer
                                >
                                
                                </v-data-table>
                            </v-container> 
                            </v-card>
                            
                        </v-col>
                    </v-row>
                </v-container>

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
            page:1,
            pageCount:0,
            
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
                    rec.RoomDesc.includes(this.room || '')
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

    },
    methods: {
        async loadRentatTotal(){
            let station=await this.handleSelectData(this.hrisUserInfo.ABBR)
             this.loadMasterMaintenance('rentalsTotal').then(res => {
                //  console.log(res.data );
                 this.rentalsTotal=res.data
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
                        //  console.log(rec);
                     })
                 }  
                 console.log(this.rentalsTotal);
             })
        },
        viewRentalDetails(data){
            this.loadMasterMaintenance('rentalsdedatils').then(res => {
                this.rentalsDetails=res.data.filter(item  => item.EmployeeCode == data.EmployeeCode)
                this.dialog= true
                
                Object.assign(this.viewRentals,data)
            })
            
        }

    },

}
</script>
