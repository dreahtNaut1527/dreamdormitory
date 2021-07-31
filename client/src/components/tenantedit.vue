<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
            <v-container fluid>
                <v-card>
                    <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                        <v-toolbar-title class="font-weight-bold text-h5">{{ isEditMode ? 'Edit' : 'New' }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon>mdi-pencil</v-icon>
                    </v-toolbar>
                    <v-container fluid>
                        <v-row justify="center">
                            <v-col class="text-center" cols="12" md="3">
                                <v-card height="100%" outlined>
                                    <v-container fluid>
                                        <v-avatar :color="themeColor == '' ? '#1976d2' : themeColor" size="132">
                                            <v-avatar size="126">
                                                <img :src="`${ isEditMode ? `${photo}/${emplcode}.jpg` : '../assets/NoPic'}`" :onerror="`this.src = '${require('../assets/NoPic.jpg')}'`" />
                                            </v-avatar>
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
                                    </v-container>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="9">
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-container class="my-4" fluid>
                                        <v-row dense>
                                            <v-col v-if="hrisUserInfo.COCODE =='20'" cols="12" md="2" sm="2"><v-subheader class="font-weight-bold">Company:</v-subheader></v-col>
                                            <v-col v-if="hrisUserInfo.COCODE =='20'" cols="12" md="10" sm="10">
                                                <v-select
                                                    v-model="editTenantDetails.CompanyCode"
                                                    placeholder="Company"
                                                    :items="filterCompany"
                                                    item-value="COCODE"
                                                    item-text="SHORTNAME"
                                                    width="20"
                                                    hide-details
                                                    :clearable="!isEditMode"
                                                    :readonly="isEditMode"
                                                    outlined
                                                    dense
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="12" md="2" sm="2"><v-subheader  class="font-weight-bold">Employee:</v-subheader></v-col>
                                            <v-col cols="12" md="2" sm="2">
                                                <v-text-field
                                                    v-model="editTenantDetails.EmployeeCode"
                                                    @keypress.enter="getStationSearch(editTenantDetails.EmployeeCode)"
                                                    @blur="getStationSearch(editTenantDetails.EmployeeCode)"
                                                    :rules="[v => !!v || 'field is required']"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    @click:clear="newRecord()"
                                                    placeholder="Code"
                                                    :clearable="!isEditMode"
                                                    :readonly="isEditMode || !editTenantDetails.CompanyCode"
                                                    hide-details
                                                    outlined
                                                    dense   
                                                ></v-text-field>
                                                <station :code.sync="editTenantDetails.EmployeeCode" :company="editTenantDetails.CompanyCode" :searchStation="getStationSearch" />
                                            </v-col>
                                            <v-col cols="12" md="7" sm="7">
                                                <v-text-field
                                                    v-model="editTenantDetails.EmployeeName"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    placeholder="Name"
                                                    hide-details
                                                    outlined
                                                    readonly
                                                    dense
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="1" sm="1">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn 
                                                            @click="editTenantDetails.CompanyCode && $modal.show('stationsearch')" 
                                                            :color="themeColor == '' ? '#1976d2' : themeColor"
                                                            v-on="on" 
                                                            v-bind="attrs" 
                                                            small 
                                                            dark
                                                            fab
                                                        >
                                                            <v-icon>mdi-magnify</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>Search Employee</span>
                                                </v-tooltip>
                                            </v-col>
                                            <v-col cols="12" md="2" sm="2"><v-subheader  class="font-weight-bold">Department:</v-subheader></v-col>
                                            <v-col cols="12" md="10" sm="10">
                                                <v-text-field
                                                    v-model="editTenantDetails.Department"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    placeholder="Department"
                                                    hide-details
                                                    outlined
                                                    readonly
                                                    dense
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="2" sm="2"><v-subheader  class="font-weight-bold">Section:</v-subheader></v-col>
                                            <v-col cols="12" md="10" sm="10">
                                                <v-text-field
                                                    v-model="editTenantDetails.Section"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    placeholder="Section"
                                                    hide-details
                                                    outlined
                                                    readonly
                                                    dense
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="2" sm="2"><v-subheader  class="font-weight-bold">Team:</v-subheader></v-col>
                                            <v-col cols="12" md="10" sm="10">
                                                <v-text-field
                                                    v-model="editTenantDetails.Team"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    placeholder="Team"
                                                    hide-details
                                                    outlined
                                                    readonly
                                                    dense
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="2" sm="2"><v-subheader class="font-weight-bold">MoveIn:</v-subheader></v-col>
                                            <v-col cols="12" md="4" sm="4">
                                                <datepicker :menu="moveInDialog" :dateValue.sync=editTenantDetails.MoveInDate dateLabel="Move-In" />
                                            </v-col>
                                            <v-col cols="12" md="2" sm="2"><v-subheader class="font-weight-bold">MoveOut:</v-subheader></v-col>
                                            <v-col cols="12" md="4" sm="4">
                                                <datepicker :menu="moveOutDialog" :dateValue.sync=editTenantDetails.MoveOutDate dateLabel="Move-Out" />
                                            </v-col>
                                            <v-col cols="12" md="2" sm="2"><v-subheader class="font-weight-bold">Rental Fee:</v-subheader></v-col>
                                            <v-col cols="12" md="10" sm="10">
                                                <v-text-field
                                                    v-model="editTenantDetails.RentalFee"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    placeholder="Team"
                                                    hide-details
                                                    outlined
                                                    dense
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="2" sm="2"><v-subheader class="font-weight-bold">Remarks:</v-subheader> </v-col>
                                            <v-col cols="12" md="10" sm="10">
                                                <v-textarea
                                                    v-model="editTenantDetails.Remarks"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    placeholder="Remarks"
                                                    hide-details
                                                    outlined
                                                    dense
                                                ></v-textarea>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn to="/tenants" class="mx-3 px-5" text>Cancel</v-btn>
                        <v-btn class="px-5" @click="saveRecord(editTenantDetails)" :color="themeColor == '' ? '#1976d2' : themeColor" dark>Save</v-btn>
                    </v-card-actions>
                </v-card>
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
import datepicker from './datepicker'
import station from './stationsearch.vue'

export default {
    data() {
        return {
            alert: false,
            valid: true,
            loading: false,
            emplcode: null,
            isEditMode: false,
            moveInDialog: false,
            moveOutDialog: false,
            stationSearchDialog: false,
            cocode: '',
            alertText: '',
            tenantsLists: [],
            companies: [],
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
        this.loadCompanies()
    },
    mounted() {
        this.loadMasterMaintenance('tenants').then(async res => {
            this.loading = true
            this.tenantsLists = res.data
            if(this.filterTenants[0] != undefined) {
                let station = await this.handleSelectData()
                let employee = station.filter(item => item.EMPLCODE == this.filterTenants[0].EmployeeCode)[0]
                Object.assign(this.editTenantDetails, {
                    ...this.filterTenants[0],
                    EmployeeName: employee.EMPNAME || null,
                    Department: employee.DEPTDESC || null,
                    Section: employee.SECTIONDESC || null,
                    Team: employee.TEAMDESC || null,
                    Designation: employee.DESIGDESC || null
                })
                this.loading = false
                this.$forceUpdate()
            } else {
                this.loading = false
            }
        })
    },
    computed: {
        filterTenants() {
            return this.tenantsLists.filter(rec => {
                return rec.EmployeeCode.includes(this.emplcode)
            })
        },
        filterCompany() {
            return this.companies.filter(rec => {
                return rec.SHORTNAME
            })
        }
    },
    methods: {
        loadCompanies() {
            if(this.hrisUserInfo.COCODE == '20') {
                this.axios.post(`${this.api_HRIS}/ora_company.php`, {abbr: this.hrisUserInfo.ABBR}).then(res => {
                    this.companies = res.data
                })
            } else {
                this.cocode = this.hrisUserInfo.COCODE
            }
        },
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
                    this.hrisUserInfo.COCODE == '20' ? data.CompanyCode : this.hrisUserInfo.COCODE,
                    data.EmployeeCode,
                    data.MoveInDate,
                    data.MoveOutDate,
                    data.Remarks,
                    data.RentalFee,
                    this.hrisUserInfo.USERACCT,
                    1
                ]
            }
            if(this.$refs.form.validate()) {
                this.handleQuestionMessage('', 'Do you want to save data?', 'Save', null, 'question').then(result => {
                    if(result.isConfirmed) {
                        this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                        if(this.isEditMode) {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} updated a record`)
                        } else {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} added a new record`)
                        }
                        this.$router.push('/tenants')
                        this.handleToastMesaage().fire({icon: 'success', title: 'Record saved'})
                    }
                })
            } else {
                this.alert = true
                this.alertText = 'Employee Code is required'
            }
        },
        async getStationSearch(emplcode) {
            if(this.isEditMode || !emplcode) return;
            this.loading = true
            let station = await this.handleSelectData()
            let company = this.filterCompany.filter(rec => rec.COCODE == this.editTenantDetails.CompanyCode)
            let employee = station.filter(item => item.SHORTNAME == company[0].SHORTNAME)
            let data = employee.filter(item => item.EMPLCODE == emplcode)[0]
            if(data) {
                Object.assign(this.editTenantDetails, {
                    MoveInDate: null,
                    MoveOutDate: null,
                    Remarks: null,
                    EmployeeName: data.EMPNAME || null,
                    Department: data.DEPTDESC || null,
                    Section: data.SECTIONDESC || null,
                    Team: data.TEAMDESC || null,
                    Designation: data.DESIGDESC || null,
                    RentalFee: 1500.00
                })
                this.$forceUpdate()
            } else {
                this.handleConfimedMessage('', 'No record found', 'error')
            }
            this.loading = false
        }
    },
    components: {
        datepicker,
        station
    },
}
</script>