<template>
    <v-dialog v-model="assignDialog" width="500" persistent>
        <v-card>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>Occupants</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon>mdi-account-group</v-icon>
            </v-toolbar>
            <v-container fluid>
                <v-subheader>
                    {{roomDetails.RoomDesc}}
                    <v-spacer></v-spacer>
                    Floor {{roomDetails.FloorNo}}
                </v-subheader>
                <v-row align="center" justify="center" dense>
                    <v-col v-for="(item, i) in filterOccupants" :key="i" cols="12">
                        <v-card>
                            {{item}}
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="assignDialog = !assignDialog" text>Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['dialog', 'roomDetails'],
    data() {
        return {
            assignDialog: false,
            occupants: []
        }
    },
    computed: {
        filterOccupants() {
            return this.occupants.filter(rec => {
                return (
                    rec.BuildingId.includes(this.roomDetails.BuildingId) && 
                    rec.FloorNo == this.roomDetails.FloorNo && 
                    rec.RoomNo == this.roomDetails.RoomNo
                )
            })
        }
    },
    methods: {
        loadOccupants() {
            this.loadMasterMaintenance('roomrelations').then(res => this.occupants = res.data)
        }
    },
    watch: {
        dialog() {
            this.assignDialog = true
            this.loadOccupants()
        }
    }
}
</script>