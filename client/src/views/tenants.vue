<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" flat dark>
                        <v-toolbar-title>Tenants</v-toolbar-title>
                    </v-toolbar>
                    <v-container fluid>
                        <v-row align="center" justify="center">
                            <v-col cols="12" md="3">
                                <v-autocomplete
                                    v-model="department"
                                    :items="departmentList"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    placeholder="Department"
                                    hide-details
                                    clearable
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-autocomplete
                                    v-model="section"
                                    :items="sectionList"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    placeholder="Section"
                                    hide-details
                                    clearable
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-autocomplete
                                    v-model="team"
                                    :items="teamList"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    placeholder="Team"
                                    hide-details
                                    clearable
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field
                                    v-model="searchTable"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    placeholder="Search Code or Name"
                                    append-icon="mdi-magnify"
                                    hide-details
                                    clearable
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider class="mt-4"></v-divider>
                        <v-data-table
                            :headers="headers" 
                            :items="filterTenants"
                            :search="searchTable"
                            :page.sync="page"
                            :loading="loading"
                            loading-text=""
                            @page-count="pageCount = $event"
                            hide-default-footer
                        >
                            <template v-slot:progress>
                                <v-sheet height="400">
                                    <v-container class="fill-height">
                                        <v-row class="text-center" align="center" justify="center">
                                            <v-col cols="12" md="12">
                                                <v-progress-circular
                                                    :size="70"
                                                    :width="7"
                                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                                    indeterminate
                                                ></v-progress-circular>
                                            </v-col>
                                            <v-subheader>Loading Data. . .Please Wait</v-subheader>
                                        </v-row>
                                    </v-container>
                                </v-sheet>
                            </template>
                            <template v-slot:[`item.EmployeeCode`]="{ item }">
                                <v-badge :color="themeColor == '' ? '#1976d2' : themeColor" v-if="item.BuildingId == 0" content="new">{{item.EmployeeCode}}</v-badge>
                                <div v-else>{{item.EmployeeCode}}</div>
                            </template>
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn @click="editRecord(item)" :color="themeColor == '' ? '#1976d2' : themeColor" v-on="on" v-bind="attrs" small dark fab><v-icon>mdi-pencil</v-icon></v-btn>
                                    </template>
                                    <span>Edit Record</span>
                                </v-tooltip>
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <v-chip class="caption">Move-In: {{moment(item.MoveInDate).fromNow()}}</v-chip>
                            </template>
                        </v-data-table>
                        <v-divider></v-divider>
                        <v-pagination
                            v-model="page"
                            :length="pageCount"
                            :total-visible="10"
                            :color="themeColor == '' ? '#1976d2' : themeColor"
                        ></v-pagination>
                    </v-container>
                    <v-subheader class="font-weight-bold">Total Record(s): {{ filterTenants.length }}</v-subheader>
                </v-card>
            </v-lazy>
        </v-container>
        <v-fab-transition>
            <v-btn :color="themeColor == '' ? '#1976d2' : themeColor" to="/tenantedit" :disabled="loading" fixed bottom right large dark fab>
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-fab-transition>
    </v-main>
</template>

<script>

export default {
    data() {
        return {
            loading: true,
            company: '',
            department: '',
            section: '',
            team: '',
            searchTable: '',
            pageCount: 0,
            page: 1,
            tenants: [],
            headers: [
                {text: 'Code', value: 'EmployeeCode'},
                {text: 'Name', value: 'EmployeeName'},
                {text: 'Department', value: 'Department'},
                {text: 'Section', value: 'Section'},
                {text: 'Team', value: 'Team'},
                {text: 'Actions', value: 'actions'},
                {text: 'Status', value: 'status'}
            ],
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Tenants', disabled: true, href: '#'}
            ]
        }
    },
    sockets: {
        showNotifications() {
            setTimeout(() => {
                this.loadTenants()
            }, 1500);
        }
    },
    created() {

    },
    mounted() { 
        this.loadTenants()
    },
    computed: {
        filterTenants() {
            return this.tenants.filter(rec => {
                return (
                    rec.CompanyCode.includes(this.hrisUserInfo.CODE || '') && 
                    rec.Department.includes(this.department || '') &&
                    rec.Section.includes(this.section || '') &&
                    rec.Team.includes(this.team || '')
                )
            })
        },
        departmentList() {
            return this.tenants.map(rec => {
                return rec.Department
            })
        },
        sectionList() {
            return this.filterTenants.map(rec => {
                return rec.Section
            })
        },
        teamList() {
            return this.filterTenants.map(rec => {
                return rec.Team
            })
        }
    },
    methods: {
        loadTenants() {
            this.stationSearch(null).then(res => {
                let station = res.data
                this.loadMasterMaintenance('tenants').then(res => {
                    this.tenants = res.data.filter(item => item.CompanyCode == this.hrisUserInfo.CODE)
                    if(this.tenants != []) {
                        this.tenants.forEach(rec => {
                            let employee = station.filter(item => item.EMPLCODE == rec.EmployeeCode)
                            Object.assign(rec, {
                                EmployeeName: employee[0].EMPNAME || 'NONE',
                                Department: employee[0].DEPTDESC || 'NONE',
                                Section: employee[0].SECTIONDESC || 'NONE',
                                Team: employee[0].TEAMDESC || 'NONE',
                                Designation: employee[0].DESIGDESC || 'NONE'
                            })
                            this.$forceUpdate()
                        })
                    }
                }) 
                this.loading = false 
            })
        },
        editRecord(data) {
            this.$router.push({name: 'tenantedit', query: {code: data.EmployeeCode}})
        }
    }
}
</script>