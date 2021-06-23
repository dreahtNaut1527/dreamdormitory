<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container >
            <v-toolbar color="primary" dark>
                <v-toolbar-title>
                    <span>Payroll Date : </span>
                    <span>June 31, 2021</span>
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
                                        item-text="text"
                                        item-value="floorNo"
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
                                        item-text="text"
                                        item-value="roomNo"
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
        <v-container>
            <v-card outlined>
                <v-container>
                    <v-data-table 
                        :headers="headers"
                        hide-default-footer
                    ></v-data-table>
                    <v-pagination></v-pagination>
                </v-container>
            </v-card>
        </v-container>
        <v-dialog v-model="dialog" width="1000">            
                <v-card>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>
                            Edit record
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-form>
                        <v-container>
                            <v-row justify="center"></v-row>
                        </v-container>
                    </v-form>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn>Save</v-btn>
                        <v-btn>Close</v-btn>
                    </v-card-actions>
                </v-card>            
        </v-dialog>
        v-daia
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
                {text:'Payroll Date',value:'PayrollDate'},
                {text:'Previous Reading',value:'PrevReading'},
                {text:'Latest Reading',value:'LatestReading'},
                {text:'Payroll Date',value:'PayrollDate'},
                {text:'Consumption',value:'TotalConsumption'},
                {text:'Amount/Room',value:'TotalKWM3'},
                {text:'Amount/Head',value:'TotalConsumption'},
                {text:'Actions',value:'Actions'},
            ],
            itemstype:[
                {text:'Electricity',value:'80'},
                {text:'Water',value:'10'}
            ],
            editConsumption:{                	
                    Building:'',
                    Floor:'',
                    Room:'',
                    ConsumptionType:'',
                    StartDate:null,
                    EndDate:null,
                    PayrollDate:null,
                    PrevReading:0,
                    LatestReading:0,
                    TotalConsumption:0,
                    TotalKWM3:0,
                    TotalAmount:0,
            },
            dialog:false,
            consumption:[],
            roomRelationView:[],
            selectedtype:'10',            
            page:1,
            pagecount:0,
            loading:false,
            cubickilowatt:"",
            building:"",
            room:"",
            floor:"",
            
        }
    },
    created() {
        this.consumptiontype()
        this.loadRoomRelationView()
    },
    computed:{
        buildingList(){
            return this.roomRelationView.map(rec => {
                return rec.BuildingDesc
            }).sort()
        },
        floorList(){
            return this.buildingList.map(rec => {
                return {floorNo: rec.FloorNo, text: `FLOOR ${rec.FloorNo}`}
            }).sort()
        },
        roomList(){
            return this.buildingList.map(rec => {
                return {roomNo: rec.RoomNo, text: `Room ${this.zeroPad(rec.RoomNo, 3)}`}
            })
        }
    },
    methods: {
        consumptiontype(){
            this.cubickilowatt=this.selectedtype
        },
        loadRoomRelationView(){
            this.loadMasterMaintenance('roomrelations').then(res => {
                this.roomRelationView = res.data
                console.log( this.roamRelationView);
            })
        }
    }
}
</script>