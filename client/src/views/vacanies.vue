<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-card flat>
            <v-toolbar flat>
                <v-toolbar-title class="display-1 font-weight-bold">Rooms</v-toolbar-title>
            </v-toolbar>
            <v-container>
                <v-select
                    class="caption"
                    v-model="buildings"
                    :items="buildingMasters"
                    placeholder="Building"
                    item-value="BuildingId"
                    item-text="BuildingDesc"
                    hide-details
                    outlined
                    clearable
                    dense
                ></v-select>
                <v-row v-for="(floor, i) in floors" :key="i" dense>
                    <v-container class="mb-n5 overline">
                        <v-subheader>Floor {{floor.FloorNo}}</v-subheader>
                    </v-container>
                    <v-col cols="12" md="2" v-for="(room, i) in listOfRoomsPerFloor(floor.FloorNo)" :key="i">
                        <v-hover v-slot="{ hover }">
                            <v-card @click="assignRoom(room)" :elevation="hover ? 8 : 2" v-if="room.FloorNo == floor.FloorNo" outlined>
                                <v-subheader class="font-weight-bold">
                                    {{room.RoomDesc}}  
                                    <!-- <v-spacer></v-spacer>
                                    <v-icon small>mdi-bed-empty</v-icon> -->
                                </v-subheader>
                                <v-container>
                                    <v-row align="center" justify="center" dense>
                                        <v-col v-for="(item, i) in room.Beds" :key="i" cols="12" md="6">
                                            <v-card outlined>
                                                <v-card-text class="text-center">{{item.BedNo}}</v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-hover>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <v-dialog v-model="dialog" width="500" persistent>
            <v-card>
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>Assign Rooms</v-toolbar-title>
                </v-toolbar>
                <v-form>
                    <v-container>
                        <v-row align="center" justify="center" dense>
                            <v-col cols="12" md="4">
                                <v-select
                                    class="caption"
                                    v-model="selectedRoom"
                                    :items="roomListAssign"
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
                            <v-btn @click="saveRecord()" color="primary" dark>Save</v-btn>
                        </v-card-actions>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>
        <assignroom :dialog="assignDialog" :roomDetails="roomDetails" />
        <v-fab-transition>
            <v-btn
                class="mb-12"
                color="primary"
                @click="dialog = !dialog"
                absolute
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
import assignroom from '@/components/assignroom'

export default {
    data() {
        return {
            dialog: false,
            assignDialog: false,
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
            buildingMasters: [],
            roomRelations: [],
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Vacanies', disabled: true, href: '#'}
            ]
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
        listOfRoomsPerFloor(floorNo) {
            return this.rooms.filter(rec => rec.FloorNo == floorNo)
        },
        loadMasters() {
            this.loadMasterMaintenance('buildings').then(res => this.buildingMasters = res.data)
            this.loadMasterMaintenance('floors').then(res => this.floorMasters = res.data)
            this.loadMasterMaintenance('beds').then(res => this.beds = res.data)
            this.loadMasterMaintenance('roomrelations').then(res => this.roomRelations = res.data)
        },
        assignRoom(val) {
            this.roomDetails = val
            Object.assign(this.roomDetails, {
                BuildingId: this.buildings
            })
            this.assignDialog = !this.assignDialog
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
    components: {
        assignroom
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
                        Beds: this.bedLists
                    })
                }
                previousRoom = rec.RoomNo
            })
        }
    }
}
</script>