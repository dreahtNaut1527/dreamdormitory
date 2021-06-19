<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container>
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Tenants</v-toolbar-title>
                    </v-toolbar>
                    <v-container>
                        <v-row align="center" justify="end">
                            <v-col cols="12" md="2">
                                <v-select
                                    v-model="company"
                                    :items="companyLists"
                                    placeholder="Company"
                                    hide-details
                                    clearable
                                    outlined
                                    dense
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="searchTable"
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
                            :loading="loading"
                            :search="searchTable"
                            :page.sync="page"
                            loading-text="Loading Data. . .Please Wait"
                            @page-count="pageCount = $event"
                            hide-default-footer
                        >
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-btn @click="editRecord(item)" icon><v-icon>mdi-pencil</v-icon></v-btn>
                            </template>
                        </v-data-table>
                        <v-pagination
                            v-model="page"
                            :length="pageCount"
                            :total-visible="10"
                            color="primary"
                        ></v-pagination>
                    </v-container>
                </v-card>
            </v-lazy>
        </v-container>
        <v-fab-transition>
            <v-btn
                color="primary"
                to="/tenantedit"
                fixed
                bottom
                right
                large
                dark
                fab
            >
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
                {text: 'Actions', value: 'actions'}
            ],
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Tenants', disabled: true, href: '#'}
            ]
        }
    },
    created() {
        
    },
    mounted() {
        this.loadMasterMaintenance('tenants').then(res => {
            this.tenants = res.data
            if(this.tenants != []) {
                this.tenants.forEach(rec => {
                    this.stationSearch(rec.EmployeeCode).then(res => {
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
                this.loading = false
            }
        })
    },
    computed: {
        filterTenants() {
            return this.tenants.filter(rec => {
                return (rec.ShortName.includes(this.company || ''))
            })
        },
        companyLists() {
            return this.filterTenants.map(rec => {
                return rec.ShortName
            })
        }
    },
    methods: {
        editRecord(data) {
            this.$router.push({name: 'tenantedit', query: {code: data.EmployeeCode}})
        }
    }
}
</script>