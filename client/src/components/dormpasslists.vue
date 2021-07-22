<template>
    <div>
        <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
            <v-card outlined>
                <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" flat dark>
                    <v-toolbar-title>Dormitory Pass</v-toolbar-title>
                </v-toolbar>
                <v-container fluid>
                    <v-row class="mb-2" align="center" justify="center" dense>
                        <v-col cols="12" md="2" sm="2">
                            <v-autocomplete
                                v-model="company"
                                :items="companyList"
                                :color="themeColor == '' ? '#1976d2' : themeColor"
                                placeholder="Company"
                                hide-details
                                clearable
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
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
                        <v-col cols="12" md="2" sm="2">
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
                        <v-col cols="12" md="2" sm="2">
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
                        <v-col cols="12" md="12">
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
                    <v-divider></v-divider>
                    <v-data-table
                        v-model="selectedTenants"
                        :headers="headers" 
                        :items="filterDormitoryPass"
                        :items-per-page="8"
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
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mx-3" @click="editDormPass(item)" v-on="on" v-bind="attrs" :color="themeColor == '' ? '#1976d2' : themeColor" small dark fab>
                                        <v-icon>mdi-eye</v-icon>
                                    </v-btn>
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
        <v-fab-transition>
            <v-btn
                :color="themeColor == '' ? '#1976d2' : themeColor"
                @click="printDormPass()"
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
    </div>
</template>

<script>

export default {
    data() {
        return {
            loading: false,
            searchTable: '',
            building: '',
            company: '',
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
                    rec.ShortName.includes(this.company || '') && 
                    rec.BuildingDesc.toLowerCase().includes(this.building.toLowerCase() || '') && 
                    rec.FloorDesc.includes(this.floor || '') && 
                    rec.RoomDesc.includes(this.room || '') &&
                    rec.Category == this.category
                )
            })
        },
        companyList() {
            return this.dormitoryPassLists.map(rec => {
                return rec.ShortName
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
        async loadData() {
            let stationData = []
            this.loading = true
            stationData = await this.handleSelectData()
            this.loadMasterMaintenance('dormpassheader').then(res => {
                this.dormitoryPassLists = res.data
                this.dormitoryPassLists.forEach(rec => {
                    let employee = stationData.filter(item => item.EMPLCODE == rec.EmployeeCode)[0]
                    Object.assign(rec, {
                        DormitoryPassCode: `RNTR - ${this.rightString(rec.BuildingDesc, 1)}${this.zeroPad(rec.RoomNo, 3)}${this.zeroPad(rec.BedNo, 2)}`,
                        EncodedDate: !rec.EncodedDate ? this.moment().format('YYYY-MM-DD') : rec.EncodedDate,
                        ShortName: employee.SHORTNAME || 'NONE',
                        Company: employee.COMPANY || 'NONE',
                        EmployeeName: `${employee.EMPLLNAME}, ${employee.EMPLFNAME} ${employee.EMPLMI}.` || 'NONE',
                        Department: employee.DEPTDESC || 'NONE',
                        Section: employee.SECTIONDESC || 'NONE',
                        Team: employee.TEAMDESC || 'NONE',
                        Designation: employee.DESIGDESC || 'NONE'
                    })
                    this.$forceUpdate()
                })
                this.loading = false
            })
        },
        editDormPass(data) {
            this.$router.push({name: 'dormpassedit', query: data})
        },
        printDormPass() {
            this.$router.push({name: 'dormpassidpreview', query: this.selectedTenants})
        }
    }
}
</script>