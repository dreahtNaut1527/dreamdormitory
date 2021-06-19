<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-toolbar color="transparent" flat>
            <v-spacer></v-spacer>
            <v-toolbar-title class="font-weight-bold display-1">
                 {{ isEditMode ? 'Edit' : 'New' }}<v-icon right>mdi-pencil</v-icon>
            </v-toolbar-title>
        </v-toolbar>
        <v-container>
            <v-row justify="center">
                <v-col class="text-center" cols="12" md="3">
                    <v-avatar size="126">
                        <img :src="`${ isEditMode ? `${photo}/${emplcode}.jpg` : '../assets/NoPic'}`" :onerror="`this.src = '${require('../assets/NoPic.jpg')}'`" />
                    </v-avatar>
                    <v-list color="transparent" dense>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold subtitle-1">{{ !isEditMode ? 'N/A' : editTenantDetails.EmployeeCode }} </v-list-item-title>
                                <v-list-item-subtitle class="caption">{{ !isEditMode ? 'N/A' : editTenantDetails.EmployeeName }} </v-list-item-subtitle>
                                <v-list-item-subtitle class="caption">{{ !isEditMode ? 'N/A' : editTenantDetails.Designation }} </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-row align="center" no-gutters dense>
                        <v-col cols="12" md="12">
                            <v-card-text class="font-weight-bold">Building:</v-card-text>
                        </v-col>
                        <v-col class="mt-n3" cols="12" md="12">
                            <v-card outlined>
                                <v-card-text class="my-n2">{{ !isEditMode ? 'N/A' : editTenantDetails.BuildingDesc }}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-card-text class="font-weight-bold">Floor:</v-card-text>
                        </v-col>
                        <v-col class="mt-n3" cols="12" md="12">
                            <v-card outlined>
                                <v-card-text class="my-n2">{{ !isEditMode ? 'N/A' : editTenantDetails.FloorDesc }}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-card-text class="font-weight-bold">Room:</v-card-text>
                        </v-col>
                        <v-col class="mt-n3" cols="12" md="12">
                            <v-card outlined>
                                <v-card-text class="my-n2">{{ !isEditMode ? 'N/A' : `Room ${zeroPad(editTenantDetails.RoomNo, 3)}` }}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="9">
                    <v-card outlined>
                        <v-container fluid>
                            <v-row dense>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Employee Code:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.EmployeeCode"
                                        @keypress.enter="getStationSearch(editTenantDetails.EmployeeCode)"
                                        @blur="getStationSearch(editTenantDetails.EmployeeCode)"
                                        @click:clear="newRecord()"
                                        placeholder="Code"
                                        hide-details
                                        :clearable="!isEditMode"
                                        :readonly="isEditMode"
                                        outlined
                                        dense   
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Employee Name:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.EmployeeName"
                                        placeholder="Name"
                                        hide-details
                                        outlined
                                        readonly
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Department:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.Department"
                                        placeholder="Department"
                                        hide-details
                                        outlined
                                        readonly
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Section:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.Section"
                                        placeholder="Section"
                                        hide-details
                                        outlined
                                        readonly
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Team:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.Team"
                                        placeholder="Team"
                                        hide-details
                                        outlined
                                        readonly
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>MoveIn:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="3" sm="9">
                                    <datepicker :menu="moveInDialog" :dateValue.sync=editTenantDetails.MoveInDate dateLabel="Move-In" />
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>MoveOut:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="3" sm="9">
                                    <datepicker :menu="moveOutDialog" :dateValue.sync=editTenantDetails.MoveOutDate dateLabel="Move-Out" />
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Rental Fee:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.RentalFee"
                                        placeholder="Team"
                                        hide-details
                                        outlined
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Remarks:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-textarea
                                        v-model="editTenantDetails.Remarks"
                                        placeholder="Remarks"
                                        hide-details
                                        outlined
                                        dense
                                    ></v-textarea>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn to="/vacanies" class="mx-3" text>Cancel</v-btn>
            <v-btn @click="saveRecord(editTenantDetails)" color="primary" dark>Save</v-btn>
        </v-card-actions>
    </v-main>
</template>

<script>
import datepicker from './datepicker'

export default {
    data() {
        return {
            emplcode: null,
            isEditMode: false,
            moveInDialog: false,
            moveOutDialog: false,
            tenantsLists: [],
            editTenantDetails: {},
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Tenants', disabled: false, href: '/dreamdormitory/tenants'},
                {text: 'Details', disabled: true, href: '#'}
            ]
        }
    },
    created() {
        this.emplcode = this.$route.query.code || null
        this.isEditMode = this.emplcode ? true : false
    },
    mounted() {
        this.loadMasterMaintenance('tenants').then(res => {
            this.tenantsLists = res.data
            if(this.filterTenants[0] != undefined) {
                this.stationSearch(this.filterTenants[0].EmployeeCode).then(res => {
                    Object.assign(this.editTenantDetails, {
                        ...this.filterTenants[0],
                        EmployeeName: res.data[0].EMPNAME || null,
                        Department: res.data[0].DEPTDESC || null,
                        Section: res.data[0].SECTIONDESC || null,
                        Team: res.data[0].TEAMDESC || null,
                        Designation: res.data[0].DESIGDESC || null
                    })
                    this.$forceUpdate()
                })
            }
        })
    },
    computed: {
        filterTenants() {
            return this.tenantsLists.filter(rec => {
                return rec.EmployeeCode.includes(this.emplcode)
            })
        }
    },
    methods: {
        newRecord() {
            this.emplcode = null
            this.isEditMode = false
            this.editTenantDetails = {}
            if(this.$route.query.code != undefined) this.$router.push('/tenantedit')
        },
        saveRecord(data) {
            let body = {
                procedureName: 'ProcTenants',
                values: [
                    data.CompanyCode,
                    data.EmployeeCode,
                    data.MoveInDate,
                    data.MoveOutDate,
                    data.Remarks,
                    data.RentalFee,
                    this.hrisUserInfo.USERACCT,
                    1
                ]
            }
            console.log(body);
            this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
            this.$router.push('/tenants')
            // setTimeout(() => {
            //     this.clearVariables()
            // }, 2000);
        },
        getStationSearch(emplcode) {
            if(this.isEditMode) return;
            this.axios.post(`${this.api_HRIS}/ora_stationsearch.php`, {emplcode: emplcode}).then(res => {
                Object.assign(this.editTenantDetails, {
                    CompanyCode: this.hrisUserInfo.CODE,
                    MoveInDate: null,
                    MoveOutDate: null,
                    Remarks: null,
                    EmployeeName: res.data[0].EMPNAME || null,
                    Department: res.data[0].DEPTDESC || null,
                    Section: res.data[0].SECTIONDESC || null,
                    Team: res.data[0].TEAMDESC || null,
                    Designation: res.data[0].DESIGDESC || null,
                    RentalFee: 1500.00
                })
                this.$forceUpdate()
            })
        }
    },
    components: {
        datepicker
    }
}
</script>