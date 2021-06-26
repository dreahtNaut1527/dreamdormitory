<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition"> 
            <v-toolbar color="transparent" dense flat>
                <v-subheader class="display-1 font-weight-bold">{{roomDetails.RoomDesc}}</v-subheader>
                <v-spacer></v-spacer>
                <v-subheader class="display-1 font-weight-bold">Floor {{roomDetails.FloorNo}}</v-subheader>
            </v-toolbar>
            <v-container fluid>
                <v-row align="center" justify="center">
                    <v-col v-for="(item, i) in filterCurrentOccupants" :key="i" cols="12" md="6">
                        <v-card outlined>
                            <v-overlay :value="item.CompanyCode != hrisUserInfo.CODE && item.CompanyCode" :opacity="0.4" absolute>
                                <v-row align="center" justify="center">
                                    <v-img :src="getCompanyLogo(item.CompanyCode)" max-width="250" />
                                </v-row>
                            </v-overlay>
                            <v-container>
                                <v-subheader>
                                    Bed {{item.BedNo}}
                                    <v-spacer></v-spacer>
                                    <v-chip :color="item.IsAvailable ? 'error' : 'success'" outlined dark>
                                        {{item.IsAvailable ? 'Occupied' : 'Available'}}
                                    </v-chip>
                                </v-subheader>
                                <v-row dense>
                                    <v-col cols="12" md="2" sm="2">
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
                                                        label="Code"
                                                        :rules="[v => !!v || 'field is required']"
                                                        :color="themeColor == '' ? '#1976d2' : themeColor"
                                                        @keypress.enter="assignVacant(item)"
                                                        @blur="assignVacant(item)"
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
        <v-snackbar v-model="alert" transition="scroll-x-reverse-transition" color="error" :timeout="3000" bottom right>
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
            tenantDearchDialog: false,
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
    created() {
        this.roomDetails = this.$route.query
        this.loadMasterMaintenance('availabletenants').then(res => {
            this.loadOccupants()
            this.availableTenants = res.data.filter(item => item.CompanyCode == this.hrisUserInfo.CODE)
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
                this.occupants = res.data
                this.loadCurrentOccupants(this.filterOccupants)
            })
        },
        loadCurrentOccupants(val) {
            let employee = []
            this.loading = true
            val.forEach((rec, index) => {
                if(rec.EmployeeCode != undefined && rec.CompanyCode == this.hrisUserInfo.CODE) {
                    this.axios.post(`${this.api_HRIS}/ora_stationsearch.php`, {emplcode: rec.EmployeeCode}).then(res => {
                        employee = res.data[0]
                        Object.assign(rec, {
                            EmployeeName: employee.EMPNAME || null,
                            Department: employee.DEPTDESC || null,
                            Section: employee.SECTIONDESC || null,
                            Team: employee.TEAMDESC || null,
                            Designation: employee.DESIGDESC || null,
                            Dialog: false
                        })
                        if(index + 1 == val.length) this.loading = false
                        this.currentOccupants.unshift(rec)
                    })
                } else {
                    Object.assign(rec, {
                        EmployeeName: employee.EMPNAME || null,
                        Department: employee.DEPTDESC || null,
                        Section: employee.SECTIONDESC || null,
                        Team: employee.TEAMDESC || null,
                        Designation: employee.DESIGDESC || null,
                        Dialog: false
                    })
                    this.currentOccupants.push(rec)
                    if(index + 1 == val.length) this.loading = false
                }
            })
        },
        getAvailableTenants(code) {
            return this.availableTenants.filter(rec => {
                return rec.EmployeeCode == code
            })
        },
        assignVacant(data) {
            this.currentOccupants.forEach(rec => {
                if(rec.BedNo == data.BedNo && rec.EmployeeCode) {
                    let tenant = this.getAvailableTenants(data.EmployeeCode)
                    Object.assign(rec, tenant[0])
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
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                setTimeout(() => {
                    this.clearVariables()
                }, 2000);
            } else {
                this.alert = true
                this.alertText = 'Employee Code is required'
            }
        },
        clearVariables() {
            this.occupants = []
            this.currentOccupants = []
            this.availableTenants = []
            this.loadOccupants()
            this.loadMasterMaintenance('availabletenants').then(res => this.availableTenants = res.data)
            this.$refs.form.resetValidation()
        }

    },
    watch: {
        availableTenants(val) {
            val.forEach(rec => {
                this.axios.post(`${this.api_HRIS}/ora_stationsearch.php`, {emplcode: rec.EmployeeCode}).then(res => {
                    Object.assign(rec, {
                        EmployeeName: res.data[0].EMPNAME || null,
                        Department: res.data[0].DEPTDESC || null,
                        Section: res.data[0].SECTIONDESC || null,
                        Team: res.data[0].TEAMDESC || null,
                        Designation: res.data[0].DESIGDESC || null
                    })
                    this.$forceUpdate()
                })
            })
        }
    },
    components: {
        tenantdetails
    }
}
</script>