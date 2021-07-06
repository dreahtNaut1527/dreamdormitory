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
                <v-container>
                    <v-row align= 'center' justify='center'>
                        <v-col cols='12' md='4' sm='3'>
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
                        <v-col cols='12' md='4' sm='3'>
                            <v-autocomplete 
                                dense
                                hide-details
                                outlined
                                v-model="floor"
                                label="Floors"
                                :items="floorList"
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='12' md='4' sm='3'>
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
                <v-container>
                    <v-data-table
                        :headers="headers"
                        :items="filterRentals"
                        hide-default-footer
                        :page.sync='page'
                        @page-count="pageCount = $event"
                        :single-expand="true"
                        :expaned.sync="expanded"
                        show-expand
                        item-key="SerialNo"
                        loading-text="Loading Data. Please Wait..."                        
                    >   

                         <template v-slot:[`item.data-table-expand`]="{ expand, isExpanded }">
                              <v-icon @click="expand(!isExpanded)" color="primary">
                                   {{isExpanded ?' mdi-minus-circle-outline' : 'mdi-plus-circle-outline'  }}
                              </v-icon>
                         </template>
                        <template v-slot:expanded-item="{ headers, item }">
                            <td :colspan="headers.length">                                
                                <v-data-iterator
                                    :items="filterBIllingInfo(item)" 
                                    hide-default-footer                                   
                                >
                                    <template v-slot:default="{ items }">
                                        <v-spacer></v-spacer>
                                        <!-- <v-container fluid dense class="grey lighten-5 mb-6"> -->
                                        <v-row dense v-for="(item, i) in items" :key="i">
                                            
                                                <td style="width:100px">                                                    
                                                    {{item.EmployeeCode}}                                                   
                                                </td>
                                           
                                               
                                                <td style="width: 100px">                                            
                                                    {{item.XCode}}
                                                </td>
                                        
                                             
                                                 <td>                                               
                                                    {{item.Amount}}
                                                </td>
                                            
                                        </v-row>
                                         <!-- </v-container> -->
                                    </template>
                                </v-data-iterator>
                            </td>
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
        width="500">
            <v-card>
                <v-container>
                    <v-row>
                        <v-col cols="12" md="4" sm="4"></v-col>
                        <v-col cols="12" md="8" sm="8"></v-col>
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
                {text:'Building', value:'BuildingDesc'},
                {text:'Floor', value:'FloorDesc'},
                {text:'Room', value:'RoomDesc'},
                {text:'Payroll Date', value:'PayrollDate'},
                {text:'Total Amount', value:'TotalAmount'},
                {text: '', value: 'data-table-expand' },
                
            ],
            rentals:[],
            expanded:[],
            billingInfos:[],
            singleExpand:true,
            setcutoffdialog:false,
            dialog:false,
            building:'',
            floor:'',
            room:'',
            payrollDate:'',
            page:1,
            pageCount:0,
            
        }
    },
    created() {
        this.setcutoffdialog=!this.setcutoffdialog
        this.loadMasterMaintenance('billinginfos').then(res => {
            this.billingInfos = res.data
            console.log(res.data);
        })
    },
    computed:{
        filterRentals(){
            return this.rentals.filter(rec =>{
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
        filterBIllingInfo(data){
            console.log(this.billingInfos);
            return this.billingInfos.filter(rec => {
                return (
                    rec.SerialNo.includes(data.SerialNo)                    
                )
            })            
        }
    },

}
</script>
<style>
    table, td, th {  
    border: 1px solid #ddd;
    text-align: left;
    background-color:azure;
    }

    table {
    border-collapse: collapse;
    width: 100%;
    }

    th, td {
    padding: 5px;
    }
</style>