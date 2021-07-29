<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
            <v-container fluid>
                <v-tabs v-model="tab" :background-color="themeColor == '' ? '#1976d2' : themeColor" @change="getBuilding()" icons-and-text centered grow dark>
                    <v-tab v-for="(item, i) in buildingMasters" :key="i">
                        {{item.BuildingDesc}}
                        <v-icon>mdi-domain</v-icon>
                    </v-tab>
                </v-tabs>
                <v-radio-group v-model="floor" row>
                    <v-radio
                        v-for="(item, i) in floorMasters"
                        :key="i"
                        :value="item.FloorNo"
                        :label="item.FloorDesc"
                        :color="themeColor == '' ? '#1976d2' : themeColor"
                    ></v-radio>
                </v-radio-group>
                <v-data-iterator
                    :items="listOfRoomsPerFloor(floor)"
                    :items-per-page="20"
                    :page.sync="page"
                    @page-count="pageCount = $event"
                    hide-default-footer
                >
                    <template v-slot:default="props">
                        <v-row dense>
                            <v-col cols="12" lg="3" md="4" sm="4" v-for="(room, i) in props.items" :key="i">
                                <v-hover v-slot="{ hover }" open-delay="50">
                                    <v-card class="rounded-xl transition-swing" :elevation="hover ? 16 : 3" @click="assignRoom(room)" outlined>
                                        <v-subheader class="font-weight-black">
                                            {{ room.RoomDesc }}  
                                            <v-spacer></v-spacer>
                                            <v-sheet 
                                                v-if="getTotalOccupants(room.Beds) < 4 && getTotalOccupants(room.Beds) > 0" 
                                                class="caption text-center rounded-circle mt-n8 pa-1" 
                                                color="red" 
                                                width="30" 
                                                dark
                                            >
                                                {{ getTotalOccupants(room.Beds) }}
                                            </v-sheet>
                                        </v-subheader>
                                        <v-container fluid>
                                            <v-row justify="start" dense>
                                                <v-col v-for="(item, i) in sortOccupants(room.Beds)" :key="i" class="mr-n3" cols="12" lg="2" md="3" sm="3">
                                                    <v-avatar class="text-center" size="50">
                                                        <v-img :src="!item.EmployeeCode ? '' : `${photo}/${item.EmployeeCode}.jpg`" />
                                                    </v-avatar>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </v-hover>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-slot:no-data>
                        <v-row align="center" justify="center">
                            <v-col cols="12" md="12">
                                <v-sheet color="transparent" height="500">
                                    <v-container class="fill-height">
                                        <v-card-text class="font-weight-bold text-center grey--text display-1">No data found</v-card-text>
                                    </v-container>
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-iterator>
                <!-- <v-pagination
                    class="mt-4"
                    v-model="page"
                    :length="pageCount"
                    :total-visible="10"
                    :color="themeColor == '' ? '#1976d2' : themeColor"
                ></v-pagination> -->
            </v-container>
        </v-lazy>
        <v-dialog v-model="dialog" width="500" persistent>
            <v-card>
                <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark flat>
                    <v-toolbar-title>Assign Rooms</v-toolbar-title>
                </v-toolbar>
                <v-form>
                    <v-container>
                        <v-row align="center" justify="center" dense>
                            <v-col cols="12" md="4">
                                <v-select
                                    class="caption"
                                    v-model="selectedRoom"
                                    :items="roomListMaster"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    placeholder="Rooms"
                                    item-value="RoomNo"
                                    item-text="RoomDesc"
                                    hide-details
                                    outlined
                                    clearable
                                    dense
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select
                                    class="caption"
                                    v-model="selectedFloor"
                                    :items="floorMasters"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    placeholder="Floors"
                                    item-value="FloorNo"
                                    item-text="FloorDesc"
                                    hide-details
                                    outlined
                                    clearable
                                    dense
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select
                                    class="caption"
                                    v-model="selectedBuildings"
                                    :items="buildingMasters"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    placeholder="Building"
                                    item-value="BuildingId"
                                    item-text="BuildingDesc"
                                    hide-details
                                    outlined
                                    clearable
                                    dense
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row align="center" justify="center" dense>
                            <v-col v-for="(item, i) in beds" :key="i" cols="12" md="6">
                                <v-card outlined>
                                    <v-subheader class="font-weight-bold">{{item.BedDesc}}</v-subheader>
                                    <v-card-text class="text-center">
                                        <v-icon x-large>mdi-bed-empty</v-icon>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="clearVariables()" text>Cancel</v-btn>
                            <v-btn @click="saveRecord()" :color="themeColor == '' ? '#1976d2' : themeColor" dark>Save</v-btn>
                        </v-card-actions>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>
        <!-- <v-fab-transition>
            <v-btn :color="themeColor == '' ? '#1976d2' : themeColor" @click="dialog = !dialog" fixed bottom right large dark fab>
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-fab-transition> -->
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            hover: false,
            dialog: false,
            loading: false,
            tab: 0,
            page: 1,
            floor: 1,
            pageCount: 0,
            buildings: '',
            selectedBeds: '',
            selectedRoom: '',
            selectedFloor: '',
            selectedBuildings: '',
            beds: [],
            rooms: [],
            floors: [],
            roomDetails: [],
            floorMasters: [],
            roomListMaster: [],
            buildingMasters: [],
            roomRelations: [],
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Vacancies', disabled: true, href: '#'}
            ]
        }
    },
    sockets: {
        showNotifications() {
            setTimeout(() => {
                this.loadMasters()
            }, 1500);
        }
    },
    created() {
        this.loadMasters()
    },
    computed: {
        filterRooms() {
            return this.roomRelations.filter(rec => {
                return (
                    rec.BuildingId.includes(this.buildings)
                )
            })
        },
        floorLists() {
            return this.filterRooms.map(rec => {
                return rec.FloorNo
            }).sort()
        },  
        roomLists() {
            return this.rooms.map(rec => {
                return rec.RoomNo
            })
        },
        bedLists() {
            return this.beds.filter(rec => {
                return rec
            })
        },

        // For Dialog
        roomListAssign() {
            return this.roomRelations.filter(rec => {
                return rec
            })
        },
    },
    methods: {
        getBuilding() {
            this.buildings = this.buildingMasters[this.tab].BuildingId
        },
        listOfRoomsPerFloor(floorNo) {
            return this.rooms.filter(rec => rec.FloorNo == floorNo)
        },
        getTenantsPerRoom(floorNo, roomNo) {
            return this.filterRooms.filter(rec => rec.FloorNo == floorNo && rec.RoomNo == roomNo)
        },
        getTotalOccupants(data) {
            let total = 0
            data.forEach(rec => {
                if(!rec.EmployeeCode) {
                    total++
                }
            })
            return total
        },
        sortOccupants(data) {
            return data.filter(rec => {
                return rec
            }).sort((a, b) => b.EmployeeCode - a.EmployeeCode)
        },
        loadMasters() {
            this.loading = true
            this.loadMasterMaintenance('buildings').then(res => {
                this.buildingMasters = res.data
                this.getBuilding()
                this.loading = false
            })
            this.loadMasterMaintenance('floors').then(res => this.floorMasters = res.data)
            this.loadMasterMaintenance('rooms').then(res => this.roomListMaster = res.data)
            this.loadMasterMaintenance('beds').then(res => this.beds = res.data)
            this.loadMasterMaintenance('roomrelations').then(res => this.roomRelations = res.data)
        },
        assignRoom(val) {
            this.roomDetails = val
            Object.assign(this.roomDetails, {
                BuildingId: this.buildings
            })
            this.$router.push({name: 'assignroom', query: this.roomDetails})
        },
        saveRecord() {
            this.beds.forEach(rec => {
                let body = {
                    procedureName: 'ProcRoomRelations',
                    values: [
                        this.selectedBuildings,
                        this.selectedFloor,
                        this.selectedRoom,
                        rec.BedNo,
                        this.hrisUserInfo.USERACCT
                    ]
                }
                // console.log(body);
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} added a new record`)
            })
            this.clearVariables()
            this.loadMasters()
        },
        clearVariables() {
            this.selectedBeds = ''
            this.selectedRoom = ''
            this.selectedFloor = ''
            this.selectedBuildings = ''
            this.dialog = !this.dialog
        }
    },
    watch: {
        floorLists(val) {
            let previousFloor = null
            this.floors = []
            val.forEach(rec => {
                if(previousFloor != rec && rec != 0) {
                    this.floors.push({
                        FloorNo: rec,
                        FloorDesc: rec
                    })
                }
                previousFloor = rec
            })
        },
        filterRooms(val) {
            let previousRoom = null
            this.rooms = []
            val.forEach(rec => {
                if(previousRoom != rec.RoomNo) {
                    this.rooms.push({
                        FloorNo: rec.FloorNo,
                        RoomNo: rec.RoomNo,
                        RoomDesc: `Room ${this.zeroPad(rec.RoomNo, 3)}`,
                        Beds: this.getTenantsPerRoom(rec.FloorNo, rec.RoomNo)
                    })
                }
                previousRoom = rec.RoomNo
            })
        }
    }
}
</script>