<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" flat dark>
                        <v-toolbar-title>Rooms</v-toolbar-title>
                    </v-toolbar>
                    <v-container fluid>
                        <v-row align="center" justify="end">
                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="searchTable"
                                    placeholder="Search Rooms"
                                    append-icon="mdi-magnify"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    hide-details
                                    outlined
                                    dense
                                >
                                    <template v-slot:append-outer>
                                        <v-btn @click="handleExportExcel" class="mt-n2" :color="themeColor == '' ? '#1976d2' : themeColor" fab small dark><v-icon>mdi-file-find</v-icon></v-btn>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider class="mt-4"></v-divider>
                        <v-data-table
                            :headers="headers"
                            :items="rooms"
                            :search="searchTable"
                            :loading="loading"
                            :page.sync="page"
                            @page-count="pageCount = $event"
                            loading-text="Loading Data... Please wait."
                            hide-default-footer
                        >
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn @click="editRecord(item)" :color="themeColor == '' ? '#1976d2' : themeColor" v-on="on" v-bind="attrs" small dark fab><v-icon>mdi-pencil</v-icon></v-btn>
                                    </template>
                                    <span>Edit Record</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                        <v-pagination
                            v-model="page"
                            :length="pageCount"
                            :total="10"
                            :color="themeColor == '' ? '#1976d2' : themeColor"
                        ></v-pagination>
                    </v-container>
                </v-card>
            </v-lazy>
        </v-container>
        <modal name="room" :adaptive="true" :draggable="true" :focusTrap="true" :reset="true" height="auto" @before-close="clearVariables()">
            <v-card>
                <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                    <v-toolbar-title>
                        <span>{{editMode ? 'Edit Record' : 'Create New'}}</span>
                    </v-toolbar-title>
                </v-toolbar>
           
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-container>
                        <v-row align="center" justify="center">
                            <v-col cols="12" md="12">
                                <v-text-field
                                    v-model="editRooms.RoomDesc"
                                    dense
                                    outlined
                                    label="Room Description"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    :rules="[v => !!v || 'Room Description is required']"
                                    @keypress.enter="saveRecord(editBeds)"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions>    
                    <v-spacer></v-spacer>
                    <v-btn class="px-5" @click="$modal.hide('room')" text>Cancel</v-btn>
                    <v-btn class="px-5" @click="saveRecord(editRooms)" :color="themeColor == '' ? '#1976d2' : themeColor" dark>Save</v-btn>
                </v-card-actions> 
            </v-card>
        </modal>
        <v-fab-transition>
            <v-btn
                :color="themeColor == '' ? '#1976d2' : themeColor"
                @click="$modal.show('room')"
                fixed
                bottom
                right
                large
                dark
                fab                
            >
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </v-fab-transition>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            breadCrumbsItems: [ 
                {text: 'Maintenance', disabled: false, href: '#'},
                {text: 'Rooms', disabled: true, href: '#'}
            ],
            headers:[
                {text:"Room No.", value:"RoomNo"},
                {text:"Room Description", value:"RoomDesc"},
                {text:"Created", value:"CreatedDate"},
                {text:"Room No.", value:"UpdatedDate"},
                {text:"Actions", value:"actions"},
            ],
            editRooms:{
                RoomNo:"",
                RoomDesc:"",
            },
            editMode:false,
            searchTable:"",
            rooms:[],
            loading:false,
            dialog:false,
            page:1,
            pageCount:0,
            valid:true,
        }
    },
    created() {
        // Load Rooms
        this.loadMasterMaintenance('rooms').then(res => {
            this.rooms=[]
            this.rooms = res.data
        })

    },
    methods: {
        editRecord(data){
           Object.assign(this.editRooms,data)
           this.dialog=!this.dialog
           this.editMode=true
           this.$modal.show('room')
        },
        saveRecord(data) {
                let body = {
                    procedureName: 'ProcRooms',
                    values: [
                        data.RoomNo,
                        data.RoomDesc,
                        this.hrisUserInfo.USERACCT,
                        1
                    ]
                }
            if (this.$refs.form.validate()){
                // console.log(body);
                this.handleQuestionMessage('', 'Do you want to save data?', 'Save', null, 'question').then(result => {
                    if(result.isConfirmed) {
                        this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                        if(this.editMode) {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} updated a record`)
                        } else {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} added a new room`)
                        }
                        this.clearVariables()
                        this.handleToastMesaage().fire({icon: 'success', title: 'Record saved'})
                        this.$modal.hide('room')
                    }
                })
            }
        },
        handleExportExcel() {
            let data = []
            this.handleQuestionMessage('', 'Export to Excel?', 'Export', null, 'question').then(result => {
                if(result.isConfirmed) {
                    this.rooms.forEach(rec => {
                        data.push({
                            No: rec.RoomNo,
                            Room: `Room ${rec.RoomNo}`,
                            Created: this.moment(rec.CreatedDate).format('YYYY-MM-DD')
                        })
                    })
                    this.exportExcel(data, 'Rooms')
                }
            })
        },
        clearVariables(){
            this.editRooms={
               RoomNo: '',
               RoomDesc: '', 
            }
            this.editMode= false
            this.dialog=false
            this.loading=false
            this.loadMasterMaintenance('rooms').then(res => {
                this.rooms=[]
                this.rooms = res.data
            })
            this.$refs.form.resetValidation()
        }
    }
}
</script>