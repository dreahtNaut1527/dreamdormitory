<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-toolbar color="transparent" dense flat>
            <v-subheader class="display-1 font-weight-bold">{{roomDetails.RoomDesc}}</v-subheader>
            <v-spacer></v-spacer>
            <v-subheader class="display-1 font-weight-bold">Floor {{roomDetails.FloorNo}}</v-subheader>
        </v-toolbar>
        <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition"> 
            <v-container fluid>
                <v-row align="center" justify="center">
                    <v-col v-for="(item, i) in filterCurrentOccupants" :key="i" cols="12" md="6">
                        <v-card class="rounded-xl" outlined>
                            <v-container>
                                <v-subheader>
                                    Bed {{item.BedNo}}
                                    <v-spacer></v-spacer>
                                    <v-chip :color="item.IsAvailable ? 'error' : 'success'" outlined dark>
                                        {{item.IsAvailable ? 'Occupied' : 'Available'}}
                                    </v-chip>
                                </v-subheader>
                                <v-row dense>
                                    <v-col class="text-center" cols="12" md="2" sm="2">
                                        <v-avatar class="mt-5" size="80">
                                            <img :src="item.EmployeeName ? `${photo}/${item.EmployeeCode}.jpg` : require('../assets/NoPic.jpg')" :onerror="`this.src = '${require('../assets/NoPic.jpg')}'`" />
                                        </v-avatar>
                                    </v-col>
                                    <v-col cols="12" md="10" sm="10">
                                    <v-form ref="form" v-model="valid" lazy-validation>
                                        <v-container>
                                            <v-row class="mt-4" dense>
                                                <v-col cols="12" md="3" sm="3">
                                                    <v-text-field
                                                        class="caption"
                                                        v-model="item.EmployeeCode"
                                                        label="Employee ID"
                                                        :rules="[v => !!v || 'field is required']"
                                                        :color="themeColor == '' ? '#1976d2' : themeColor"
                                                        @keypress.enter="assignVacant(item)"
                                                        @blur="assignVacant(item)"
                                                        @dblclick="tenantSearchDialog = !tenantSearchDialog"
                                                        :readonly="item.IsAvailable"
                                                        :clearable="!item.IsAvailable"
                                                        hide-details
                                                        outlined
                                                        dense
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="9" sm="9">
                                                    <v-text-field
                                                        class="caption"
                                                        v-model="item.EmployeeName"
                                                        :color="themeColor == '' ? '#1976d2' : themeColor"
                                                        label="Name"
                                                        hide-details
                                                        readonly
                                                        outlined
                                                        filled
                                                        dense
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="12" sm="12">
                                                    <v-text-field
                                                        class="caption"
                                                        v-model="item.Department"
                                                        :color="themeColor == '' ? '#1976d2' : themeColor"
                                                        label="Department"
                                                        hide-details
                                                        readonly
                                                        outlined
                                                        filled
                                                        dense
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="12" sm="12">
                                                    <v-text-field
                                                        class="caption"
                                                        v-model="item.Section"
                                                        :color="themeColor == '' ? '#1976d2' : themeColor"
                                                        label="Section"
                                                        hide-details
                                                        readonly
                                                        outlined
                                                        filled
                                                        dense
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="12" sm="12">
                                                    <v-text-field
                                                        class="caption"
                                                        v-model="item.Team"
                                                        :color="themeColor == '' ? '#1976d2' : themeColor"
                                                        label="Team"
                                                        hide-details
                                                        readonly
                                                        outlined
                                                        filled
                                                        dense
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            </v-container>
                                        </v-form>
                                    </v-col>
                                </v-row>
                                <v-card-actions>
                                    <v-btn v-if="item.IsAvailable" @click="viewTenantDetails(item)" class="text-xs-caption" color="primary" small text>View More...</v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn v-if="!item.IsAvailable" @click="saveRecord(item, i)" :color="themeColor == '' ? '#1976d2' : themeColor" small dark>
                                        <v-icon left>mdi-content-save</v-icon>Save
                                    </v-btn>
                                </v-card-actions>
                            </v-container>
                        </v-card>
                        <tenantdetails :dialog="item.Dialog" :details="item" />
                    </v-col>
                </v-row>
            </v-container>
        </v-lazy>
        <v-overlay :value="loading">
            <v-progress-circular
                indeterminate
                size="126"
                :color="themeColor == '' ? '#1976d2' : themeColor"
            ></v-progress-circular>
        </v-overlay>
        <v-snackbar v-model="alert" transition="scroll-x-reverse-transition" color="error" :timeout="3000" top right>
            {{ alertText }}
        </v-snackbar>
    </v-main>
</template>

<script>
import tenantdetails from './tenantdetails'

export default {
    data() {
        return {
            alert: false,
            valid: true,
            loading: false,
            assignDialog: false,
            alertText: '',
            stationImg: '',
            occupants: [],
            availableTenants: [],
            currentOccupants: [],
            roomDetails: [],
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Vacancies', disabled: false, href: '/dreamdormitory/vacancies'},
                {text: 'Assign Rooms', disabled: true, href: '#'}
            ]
        }
    },
    sockets: {
        showNotifications() {
            setTimeout(() => {
                this.clearVariables()
            }, 1500);
        }
    },
    created() {
        this.roomDetails = this.$route.query
        this.loadMasterMaintenance('availabletenants').then(res => {
            this.availableTenants = this.hrisUserInfo.COCODE == '20' ? res.data : res.data.filter(item => item.CompanyCode == this.hrisUserInfo.COCODE)
            this.loadOccupants()
        })
    },
    computed: {
        filterCurrentOccupants() {
            return this.currentOccupants.filter(rec => {
                return rec
            }).sort((a, b) => a.BedNo - b.BedNo)
        },
        filterOccupants() {
            return this.occupants.filter(rec => {
                return (
                    rec.BuildingId.includes(this.roomDetails.BuildingId) && 
                    rec.FloorNo == this.roomDetails.FloorNo && 
                    rec.RoomNo == this.roomDetails.RoomNo
                )
            })
        },
    },
    methods: {
        viewTenantDetails(data) {
            data.Dialog = !data.Dialog
            this.$forceUpdate()
        },
        loadOccupants() {
            this.loadMasterMaintenance('roomrelations').then(res => {
                this.loading = true
                this.occupants = res.data
                this.loadCurrentOccupants(this.filterOccupants)
            })
        },
        async loadCurrentOccupants(val) {
            let employee = []
            let station = await this.handleSelectData()
            val.forEach((rec, index, array) => {
                if(rec.EmployeeCode != undefined) {
                    employee = station.filter(item => item.EMPLCODE == rec.EmployeeCode)[0]
                    Object.assign(rec, {
                        EmployeeName: employee.EMPNAME || null,
                        Department: employee.DEPTDESC || null,
                        Section: employee.SECTIONDESC || null,
                        Team: employee.TEAMDESC || null,
                        Designation: employee.DESIGDESC || null,
                        Dialog: false
                    })
                    this.currentOccupants.unshift(rec)
                    this.loading = false
                } else {
                    Object.assign(rec, {
                        EmployeeName: null,
                        Department: null,
                        Section: null,
                        Team: null,
                        Designation: null,
                        Dialog: false
                    })
                    this.currentOccupants.push(rec)
                    this.loading = false
                }

                if(index == array.lenght) {
                    this.loading = false
                }
            })
        },
        async getAvailableTenants(code) {
            let newAssignedTenant = {}
            let station = await this.handleSelectData()
            this.availableTenants.forEach(rec => {
                if(rec.EmployeeCode == code) {
                    let employees = station.filter(item => item.EMPLCODE == code)[0]
                    Object.assign(newAssignedTenant, {
                        ...rec,
                        EmployeeName: employees.EMPNAME || null,
                        Department: employees.DEPTDESC || null,
                        Section: employees.SECTIONDESC || null,
                        Team: employees.TEAMDESC || null,
                        Designation: employees.DESIGDESC || null
                    })
                    this.$forceUpdate()
                }
            })
            return newAssignedTenant
        },
        assignVacant(data) {
            this.currentOccupants.forEach(async rec => {
                if(rec.BedNo == data.BedNo && rec.EmployeeCode) {
                    let tenant = await this.getAvailableTenants(data.EmployeeCode)
                    Object.assign(rec, tenant)
                    if(!rec.EmployeeName) {
                        this.alert = true
                        this.alertText = 'Employee does not registered as tenant'
                    }
                } else if(!rec.EmployeeCode) {
                    Object.assign(rec, {
                        EmployeeName: null, 
                        Department: null,
                        Section: null,
                        Team: null,
                        Designation: null,
                        MoveInDate: null,
                        MoveOutDate: null,
                        Dialog: false
                    })
                }
                this.$forceUpdate()
            })
        },
        saveRecord(data, index) {
            let body = {
                procedureName: 'ProcAssignTenants',
                values: [
                    data.EmployeeCode,
                    data.BuildingId,
                    data.FloorNo,
                    data.RoomNo,
                    data.BedNo,
                    this.hrisUserInfo.USERACCT,
                    0
                ]
            }
            if(this.$refs.form[index].validate()) {
                this.handleQuestionMessage('', 'Do you want to save data?', 'Save', null, 'question').then(result => {
                    if(result.isConfirmed) {
                        this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                        setTimeout(() => {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} assigned tenants to Room ${this.zeroPad(data.RoomNo, 3)}`)
                        }, 2000);
                        this.$refs.form[index].resetValidation()
                        this.handleToastMesaage().fire({icon: 'success', title: 'Record saved'})
                    }
                })
            } else {
                this.alert = true
                this.alertText = 'Employee Code is required'
            }
        },
        clearVariables() {
            this.occupants = []
            this.currentOccupants = []
            this.availableTenants = []
            this.loadMasterMaintenance('availabletenants').then(res => {
                this.availableTenants = this.hrisUserInfo.COCODE == '20' ? res.data : res.data.filter(item => item.CompanyCode == this.hrisUserInfo.COCODE)
                this.loadOccupants()
            })
        }

    },
    components: {
        tenantdetails
    }
}
</script>