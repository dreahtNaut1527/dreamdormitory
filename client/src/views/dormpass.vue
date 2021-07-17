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
        <v-dialog v-model="dialog" width="1000">
            <v-app-bar :color="themeColor == '' ? '#1976d2' : themeColor">
                <v-pagination
                    v-model="idPage"
                    :length="idPageCount"
                    :total-visible="0"
                    :color="themeColor == '' ? '#1976d2' : themeColor"
                ></v-pagination>
                <v-spacer></v-spacer>
                <v-btn @click="printDormitoryID('dormID')" dark>Print ID</v-btn>
            </v-app-bar>
            <v-card tile>
                <v-container id="dormID" fluid>
                    <v-data-iterator 
                        :items="selectedTenants"
                        :items-per-page="3"
                        :page.sync="idPage"
                        @page-count="idPageCount = $event"
                        hide-default-footer
                    >
                        <template v-slot:default="props">
                            <v-row v-for="(item, i) in props.items" :key="i" cols="12" dense>
                                <v-col cols="12" md="6">
                                    <v-card height="100%" outlined light>
                                        <v-card-text class="text-center">
                                            <div class="font-weight-bold text-h6 mt-n3">DREAM DORMITORY PASS</div>
                                            <div class="caption">General Trias, Cavite</div>
                                        </v-card-text>
                                        <v-list-item>
                                            <v-list-item-content class="mt-n6">
                                                <v-list-item-title class="font-weight-bold">{{ item.EmployeeName }}</v-list-item-title>
                                                <v-list-item-subtitle class="mt-2">{{ item.Company }}</v-list-item-subtitle>
                                                <v-list-item-subtitle class="mt-2">{{ item.Department }} Department</v-list-item-subtitle>
                                                <v-list-item-subtitle class="mt-2">{{ item.BuildingDesc }} - Room {{ item.RoomNo }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                            <v-list-item-action class="text-center mt-n2">
                                                <v-avatar color="grey darken-4" size="110" tile>
                                                    <v-avatar size="108" tile>
                                                        <v-img :src="`${photo}/${item.EmployeeCode}.jpg`" />
                                                    </v-avatar>
                                                </v-avatar>
                                                <v-list-item-action-text class="mr-3 font-weight-bold">{{dormitoryPassCode(item)}}</v-list-item-action-text>
                                            </v-list-item-action>
                                        </v-list-item>
                                        <v-sheet class="text-center white--text mb-1" color="grey darken-1" width="100%" tile>
                                            <div class="caption">Bed Space Rental Trial valid until {{moment(item.ValidDate).format('MMMM DD, YYYY')}}</div>
                                        </v-sheet>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-card height="100%" outlined light>
                                        <v-container class="fill-height">
                                            <v-row class="text-center mt-12" align="center" justify="center">
                                                <v-card-text>
                                                    In case of loss, please surrender to HTI Administration
                                                </v-card-text>
                                                <v-card-text class="mt-n8">
                                                    General Affairs section
                                                </v-card-text>
                                            </v-row>
                                            <v-row>
                                                <v-card-text class="text-center mt-5">
                                                    <div class="font-weight-bold">{{ approver }}</div>
                                                    <v-divider class="mx-12"></v-divider>
                                                    Approving Authority
                                                </v-card-text>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </template>
                    </v-data-iterator>
                </v-container>
                <div class="text-center caption pb-2">- Page {{idPage}} -</div>
            </v-card>
        </v-dialog>
        <v-fab-transition>
            <v-btn
                :color="themeColor == '' ? '#1976d2' : themeColor"
                @click="dialog = !dialog"
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

export default {
    data() {
        return {
            dialog: false,
            loading: false,
            searchTable: '',
            building: '',
            company: '',
            floor: '',
            room: '',
            approver: process.env.VUE_APP_APPROVER,
            category: 0,
            idPageCount: 0,
            idPage: 1,
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
        dormitoryPassCode(data) {
            let dormPassCode = `RNTR - ${this.rightString(data.BuildingDesc, 1)}${this.zeroPad(data.RoomNo, 3)}${this.zeroPad(data.BedNo, 2)}`
            return dormPassCode
        },
        async loadData() {
            let stationData = []
            this.loading = true
            stationData = await this.handleSelectData()
            this.loadMasterMaintenance('dormpassheader').then(res => {
                this.dormitoryPassLists = res.data
                this.dormitoryPassLists.forEach(rec => {
                    let employee = stationData.filter(item => item.EMPLCODE == rec.EmployeeCode)[0]
                    Object.assign(rec, {
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
            this.$router.push({name: 'dormpassedit', params: {dormData: data}})
        }
    }
}
</script>