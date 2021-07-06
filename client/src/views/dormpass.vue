<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" flat dark>
                        <v-toolbar-title>Dormitory Pass</v-toolbar-title>
                    </v-toolbar>
                    <v-container fluid>
                        <v-row class="mb-2" align="center" justify="center" dense>
                            <v-col cols="12" md="3" sm="3">
                                <v-select
                                    v-model="building"
                                    :items="buildingLists"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    placeholder="Buildings"
                                    hide-details
                                    outlined
                                    dense
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="3" sm="3">
                                <v-select
                                    v-model="floor"
                                    :items="floorLists"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    placeholder="Floors"
                                    item-text="text"
                                    item-value="floorNo"
                                    hide-details
                                    clearable
                                    outlined
                                    dense
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="3" sm="3">
                                <v-select
                                    v-model="room"
                                    :items="roomLists"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    item-text="text"
                                    item-value="roomNo"
                                    placeholder="Rooms"
                                    hide-details
                                    clearable
                                    outlined
                                    dense
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="3" sm="3">
                                <v-select
                                    v-model="category"
                                    :items="categoryList"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    item-text="text"
                                    item-value="value"
                                    placeholder="Category"
                                    hide-details
                                    outlined
                                    dense
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <v-data-table
                            v-model="selectedTenants"
                            :headers="headers" 
                            :items="filterDormitoryPass"
                            :search="searchTable"
                            :page.sync="page"
                            :loading="loading"
                            loading-text=""
                            item-key="EmployeeCode"
                            @page-count="pageCount = $event"
                            hide-default-footer
                            show-select
                        >
                            <template v-slot:progress>
                                <v-sheet height="400">
                                    <v-container class="fill-height" fluid>
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
                                <v-badge :color="themeColor == '' ? '#1976d2' : themeColor" v-if="!item.DormitoryPassCode" content="new">{{item.EmployeeCode}}</v-badge>
                                <div v-else>{{item.EmployeeCode}}</div>
                            </template>
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-3" @click="editDormPass(item)" v-on="on" v-bind="attrs" :color="themeColor == '' ? '#1976d2' : themeColor" small dark fab><v-icon>{{ item.DormitoryPassCode ? 'mdi-eye' : 'mdi-pencil' }}</v-icon></v-btn>
                                    </template>
                                    <span>{{ item.DormitoryPassCode ? 'View Record' : 'Edit Record' }}</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                        <v-pagination
                            v-model="page"
                            :length="pageCount"
                            :total-visible="10"
                            :color="themeColor == '' ? '#1976d2' : themeColor"
                        ></v-pagination>
                    </v-container>
                    <v-subheader class="font-weight-bold">Total Record(s): {{ filterDormitoryPass.length }}</v-subheader>
                </v-card>
            </v-lazy>
        </v-container>
        <v-fab-transition>
            <v-btn
                :color="themeColor == '' ? '#1976d2' : themeColor"
                @click="printDormitoryID()"
                :disabled="selectedTenants.length == 0"
                fixed
                bottom
                right
                large
                dark
                fab
            >
                <v-icon large>mdi-file-find</v-icon>
            </v-btn>
        </v-fab-transition>
    </v-main>
</template>

<script>
import printDormID from '@/print/dormitoryId'

export default {
    data() {
        return {
            loading: false,
            searchTable: '',
            building: '',
            floor: '',
            room: '',
            category: 0,
            pageCount: 0,
            page: 1,
            selectedTenants: [],
            dormitoryPassLists: [],
            categoryList: [
                {text: 'Incoming', value: 0},
                {text: 'Outgoing', value: 1}
            ],
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
                {text: 'Dormitory Pass', disabled: true, href: '#'}
            ]
        }
    },
    sockets: {
        showNotifications() {
            setTimeout(() => {
                this.loadData()
            }, 1500);
        }
    },
    created() {
        this.loadData()
    },
    computed: {
        filterDormitoryPass() {
            return this.dormitoryPassLists.filter(rec => {
                return (
                    rec.CompanyCode.includes(this.hrisUserInfo.CODE) && 
                    rec.BuildingDesc.toLowerCase().includes(this.building.toLowerCase() || '') && 
                    rec.FloorDesc.includes(this.floor || '') && 
                    rec.RoomDesc.includes(this.room || '') &&
                    rec.Category == this.category
                )
            })
        },
        buildingLists() {
            return this.dormitoryPassLists.map(rec => {
                return rec.BuildingDesc
            })
        },
        floorLists() {
            return this.filterDormitoryPass.map(rec => {
                return {floorNo: rec.FloorDesc, text: `FLOOR ${rec.FloorNo}`}
            })
        },
        roomLists() {
            return this.filterDormitoryPass.map(rec => {
                return {roomNo: rec.RoomDesc, text: `Room ${this.zeroPad(rec.RoomNo, 3)}`}
            })
        }
    },
    methods: {
        printDormitoryID() {
            printDormID(this.selectedTenants, this.photo)
            this.selectedTenants = []
        },
        async loadData() {
            let stationData = []
            this.loading = true
            stationData = await this.handleSelectData(this.hrisUserInfo.ABBR)
            this.loadMasterMaintenance('dormpassheader').then(res => {
                this.dormitoryPassLists = res.data.filter(item => item.CompanyCode == this.hrisUserInfo.CODE)
                this.dormitoryPassLists.forEach(rec => {
                    let employee = stationData.filter(item => item.EMPLCODE == rec.EmployeeCode)
                    Object.assign(rec, {
                        EncodedDate: !rec.EncodedDate ? this.moment().format('YYYY-MM-DD') : rec.EncodedDate,
                        EmployeeName: employee[0].EMPNAME || null,
                        Department: employee[0].DEPTDESC || null,
                        Section: employee[0].SECTIONDESC || null,
                        Team: employee[0].TEAMDESC || null,
                        Designation: employee[0].DESIGDESC || null
                    })
                    this.$forceUpdate()
                })
                this.loading = false
            })
        },
        editDormPass(data) {
            this.$router.push({name: 'dormpassedit', params: {dormData: data}})
        }
    }
}
</script>