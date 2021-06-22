<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container>
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Dormitory Pass</v-toolbar-title>
                    </v-toolbar>
                    <v-container>
                        <v-row class="mb-2" align="center" justify="center" dense>
                            <v-col cols="12" md="3" sm="3">
                                <v-select
                                    v-model="building"
                                    :items="buildingLists"
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
                                    item-text="text"
                                    item-value="value"
                                    placeholder="Category"
                                    hide-details
                                    clearable
                                    outlined
                                    dense
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <v-data-table
                            :headers="headers" 
                            :items="filterDormitoryPass"
                            :search="searchTable"
                            :page.sync="page"
                            @page-count="pageCount = $event"
                            hide-default-footer
                        >
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-btn @click="editDormPass(item)" icon><v-icon>{{ item.DormitoryPassCode ? 'mdi-eye' : 'mdi-pencil' }}</v-icon></v-btn>
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
        <v-overlay :value="loading">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-main>
</template>

<script>
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
    created() {
        this.loadData()
    },
    computed: {
        filterDormitoryPass() {
            return this.dormitoryPassLists.filter(rec => {
                return (
                    rec.BuildingDesc.toLowerCase().includes(this.building.toLowerCase() || '') && 
                    rec.FloorNo >= this.floor && 
                    rec.RoomNo >= this.room &&
                    rec.Category >= this.category
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
                return {floorNo: rec.FloorNo, text: `FLOOR ${rec.FloorNo}`}
            })
        },
        roomLists() {
            return this.filterDormitoryPass.map(rec => {
                return {roomNo: rec.RoomNo, text: `Room ${this.zeroPad(rec.RoomNo, 3)}`}
            })
        }
    },
    methods: {
        loadData() {
            let stationData = []
            this.loading = true
            this.stationSearch(null).then(res => {
                stationData = res.data
                this.loadMasterMaintenance('dormpassheader').then(res => {
                    this.dormitoryPassLists = res.data || []
                    this.dormitoryPassLists.forEach(rec => {
                        let employee = stationData.filter(item => item.EMPLCODE == rec.EmployeeCode)
                        Object.assign(rec, {
                            EmployeeName: employee[0].EMPNAME || null,
                            Department: employee[0].DEPTDESC || null,
                            Section: employee[0].SECTIONDESC || null,
                            Team: employee[0].TEAMDESC || null,
                            Designation: employee[0].DESIGDESC || null
                        })
                        this.$forceUpdate()
                    })
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