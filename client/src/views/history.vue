<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <v-toolbar color="grey lighten-2" flat>
                <v-toolbar-title>History</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon>mdi-history</v-icon>
            </v-toolbar>
            <v-card flat>
                <v-container fluid>
                    <v-row dense>
                        <v-col cols="12" md="4">
                            <v-card outlined>
                                <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>Date Range</v-system-bar>
                                <v-container fluid>
                                    <v-row align="center" dense>
                                        <v-col v-for="(date, i) in dateRange" :key="i">
                                            <datepicker :menu="date.dialog" :dateValue.sync="date.value" :dateLabel="date.text" />
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card outlined>
                                <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>Category</v-system-bar>
                                <v-container fluid>
                                    <v-select
                                        v-model="selectedOptions"
                                        :items="options"
                                        :color="themeColor == '' ? '#1976d2' : themeColor"
                                        outlined
                                        dense
                                        hide-details
                                    ></v-select>
                                </v-container>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card height="100%" outlined>
                                <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>Types</v-system-bar>
                                <v-container fluid>
                                    <v-radio-group class="mt-0" v-model="selectedBilliongOptions" hide-details dense row>
                                        <v-radio
                                            v-for="(item, i) in billingTypes" :key="i"
                                            :color="themeColor == '' ? '#1976d2' : themeColor"
                                            :label="item.text"
                                            :value="item.value"
                                        ></v-radio>
                                    </v-radio-group>
                                </v-container>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-card outlined>
                                <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>Employees</v-system-bar>
                                <v-container fluid>
                                    <v-row align="center" dense>
                                        <v-col cols="12" md="4">
                                            <v-select
                                                v-model="selectedCompany"
                                                :items="companies"       
                                                :color="themeColor == '' ? '#1976d2' : themeColor"
                                                item-value="SHORTNAME"  
                                                item-text="CONAME"                                   
                                                label="Company"
                                                @change="getStation(selectedCompany)"
                                                outlined
                                                dense
                                                hide-details
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-autocomplete
                                                v-model="selectedDepartments"
                                                :items="departmentList"       
                                                :color="themeColor == '' ? '#1976d2' : themeColor"                
                                                label="Department"
                                                clearable
                                                multiple
                                                outlined
                                                dense
                                                chips
                                                small-chips
                                                hide-details
                                            ></v-autocomplete>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-card outlined>
                                <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>Filter by:</v-system-bar>
                                <v-container fluid>
                                    <v-row align="center" dense>
                                        <v-col cols="12" md="4">
                                            <v-select
                                                v-model="selectedBuilding"
                                                :items="buildingList"
                                                :color="themeColor == '' ? '#1976d2' : themeColor"
                                                label="Buildings"
                                                outlined
                                                dense
                                                hide-details
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-select
                                                v-model="selectedFloor"
                                                :items="floorList"
                                                :color="themeColor == '' ? '#1976d2' : themeColor"
                                                label="Floors"
                                                outlined
                                                dense
                                                hide-details
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-select
                                                v-model="selectedRoom"
                                                :items="filterRooms"
                                                item-value="RoomNo"    
                                                :item-text="item => `Rooms ${item.RoomNo}`"                                            
                                                :color="themeColor == '' ? '#1976d2' : themeColor"
                                                label="Rooms"
                                                outlined
                                                dense
                                                hide-details
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                {{filterTenants}}
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="pa-4 mx-2" text>Clear</v-btn>
                    <v-btn class="pa-4" :color="themeColor == '' ? '#1976d2' : themeColor" dark>Export</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-main>
</template>


<script>
import datepicker from '@/components/datepicker'

export default {
    data() {
        return {
            selectedCompany: null,
            selectedBuilding: null,
            selectedFloor: null,
            selectedRoom: null,
            selectedOptions: 0,
            selectedBilliongOptions: 0,
            selectedDepartments: [],
            roomRelations: [],
            billingTypes: [],
            companies: [],
            tenants: [],
            station: [],
            dateRange: [
                {text: 'Date From', dialog: false, value: this.moment().startOf('month').format('YYYY-MM-DD')},
                {text: 'Date To', dialog:false, value: this.moment().endOf('month').format('YYYY-MM-DD')}
            ],
            options: [
                {
                    text: 'Tenants', 
                    value: 0,
                    items: [
                        {text: 'Move Date-In', value: 0},
                        {text: 'Move Date-Out', value: 1}
                    ]
                },
                {
                    text: 'Billings', 
                    value: 1,
                    items: [
                        {text: 'Electricity', value: 0},
                        {text: 'Water', value: 1},
                        {text: 'Rentals', value: 2},
                    ]
                }
            ],
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'History', disabled: true, href: '#'}
            ]
        }
    },
    created() {
        this.getMasterMaintenance()
        this.billingTypes = this.options[0].items
    },
    computed: {
        filterTenants() {
            return this.tenants.filter(rec => {
                return (
                    rec.ShortName.includes(this.selectedCompany || null) &&
                    rec.BuildingDesc.includes(this.selectedBuilding || null) &&
                    rec.FloorDesc.includes(this.selectedFloor || null) &&
                    rec.RoomDesc.includes(`RM${this.selectedRoom}` || '') &&
                    this.selectedDepartments.includes(rec.Department || null)
                )
            })
        },
        filterRooms() { 
            return this.roomRelations.filter(rec => {
                return (
                    rec.BuildingDesc == this.selectedBuilding &&
                    rec.FloorDesc == this.selectedFloor
                )
            })
        },
        buildingList() {
            return this.roomRelations.map(rec => {
                return rec.BuildingDesc
            })
        },
        floorList() {
            return this.roomRelations.map(rec => {
                return rec.FloorDesc
            })
        },
        departmentList() {
            return this.station.map(rec => {
                return rec.DEPTDESC
            }).sort()
        },
        sectionList() {
            return this.station.map(rec => {
                return rec.DEPTDESC
            }).sort()
        }
    },
    methods: {
        getMasterMaintenance() {
            this.loadMasterMaintenance('roomrelations').then(res => this.roomRelations = res.data)
            this.loadMasterMaintenance('tenants').then(res => this.tenants = res.data)
            this.getCompanies()
        },
        getCompanies() {
            this.axios.post(`${this.api_HRIS}/ora_company.php`, {abbr: this.hrisUserInfo.ABBR}).then(res => {
                this.companies = res.data
            })
        },
        async getStation(company) {
            let stationData = await this.handleSelectData()
            this.station = stationData.filter(item => item.SHORTNAME == company)
            this.tenants.forEach(rec => {
                let employee = this.station.filter(item => item.EMPLCODE == rec.EmployeeCode)[0]
                if(employee) {
                    Object.assign(rec, {
                        ShortName: employee.SHORTNAME || 'NONE',
                        EmployeeName: employee.EMPNAME || 'NONE',
                        Department: employee.DEPTDESC || 'NONE',
                        Section: employee.SECTIONDESC || 'NONE',
                        Team: employee.TEAMDESC || 'NONE',
                        Designation: employee.DESIGDESC || 'NONE'
                    })
                }
            })
        }
    },
    components: {
        datepicker
    },
    watch: {
        selectedOptions(val) {
            this.billingTypes = this.options[val].items
        }
    }
}
</script> 