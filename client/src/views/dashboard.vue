<template>
    <v-main>
        <v-toolbar color="transparent" flat>
            <v-toolbar-title class="display-1 font-weight-bold">Dashboard</v-toolbar-title>
        </v-toolbar>
        <v-container fluid>
            <v-row justify="center">
                <v-col cols="12" lg="8" md="6">
                    <v-card>
                        <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" flat dark>
                            <v-toolbar-title>Tenants</v-toolbar-title>
                        </v-toolbar>
                        <v-data-table
                            :items="filterTenants"
                            :headers="headers"
                            :items-per-page="6"
                            hide-default-footer
                        ></v-data-table>
                    </v-card>
                </v-col>
                <v-col cols="12" lg="4" md="6">
                    <v-sheet class="elevation-2" height="400">
                        <v-toolbar flat>
                            <v-toolbar-title class="overline">Newly Registered</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-pagination
                                v-model="page"
                                :length="pageCount"
                                :total-visible="0"
                                :color="themeColor == '' ? '#1976d2' : themeColor"
                            ></v-pagination>
                        </v-toolbar>
                        <v-data-iterator
                            :items="filterNewTenants"
                            :items-per-page="5"
                            item-key="EmployeeCode"
                            :page.sync="page"
                            @page-count="pageCount = $event"
                            hide-default-footer
                            dense
                        >
                            <template v-slot:default="props">
                                <v-row align="center" justify="center" dense>
                                    <v-col cols="12" md="12" v-for="(item, i) in props.items" :key="i">
                                        <v-list-item three-line dense>
                                            <v-list-item-avatar>
                                                <v-img :src="`${photo}/${item.EmployeeCode}.jpg`" />
                                            </v-list-item-avatar>
                                            <v-list-item-content>
                                                <v-list-item-title>{{ item.EmployeeCode }}</v-list-item-title>
                                                <v-list-item-subtitle>{{ item.EmployeeName }}</v-list-item-subtitle>
                                                <v-list-item-subtitle>{{ item.Department }} / {{ item.Section }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <v-chip class="caption">Registered {{ moment(item.CreatedDate).fromNow() }}</v-chip>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-col>
                                </v-row>
                            </template>
                            <template v-slot:no-data>
                                <v-sheet height="250">
                                    <v-container class="fill-height" fluid>
                                        <v-row align="center" justify="center">
                                            <v-col cols="12" md="12" sm="12">
                                                    <v-card-text class="text-center grey--text font-weight-bold display-1">No Data</v-card-text>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-sheet>
                            </template>
                        </v-data-iterator>
                    </v-sheet>
                </v-col>
            </v-row>
            <v-row align="center" justify="center">
                <v-col cols="12" md="12">
                    <v-card elevation="0" outlined>
                        <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark flat>
                            <v-toolbar-title>Registered Tenants</v-toolbar-title>
                        </v-toolbar>
                        <v-container fluid>
                            <bargraph />
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
import bargraph from '@/components/bargraph'

export default {
    data() {
        return {
            page: 1,
            pageCount: 0,
            headers: [
                {text: 'Code', value: 'EmployeeCode'},
                {text: 'Name', value: 'EmployeeName'},
                {text: 'Department', value: 'Department'},
                {text: 'Section', value: 'Section'},
                {text: 'Team', value: 'Team'}
            ],
            tenantList: []
        }
    },
    created() {
        this.loadTenants()
    },
    mounted() {

    },
    computed: {
        filterTenants() {
            return this.tenantList.filter(rec => {
                return (
                    rec.BuildingId != 0
                )
            })
        },
        filterNewTenants() {
            return this.tenantList.filter(rec => {
                return (
                    rec.BuildingId == 0
                )
            })
        }
    },
    methods: {
        loadTenants() {
            this.stationSearch(null).then(res => {
                let station = res.data
                this.loadMasterMaintenance('tenants').then(res => {
                    this.tenantList = res.data.filter(item => item.CompanyCode == this.hrisUserInfo.CODE)
                    if(this.tenantList != []) {
                        this.tenantList.forEach(rec => {
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
            })
        },
    },
    components: {
        bargraph
    }
}
</script>