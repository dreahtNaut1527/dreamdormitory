<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container>
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar color="primary" flat dark>
                        <v-toolbar-title>Rooms</v-toolbar-title>
                    </v-toolbar>
                    <v-container>
                        <v-row align="center" justify="end">
                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="searchTable"
                                    placeholder="Search Floors"
                                    append-icon="mdi-magnify"
                                    hide-details
                                    outlined
                                    dense
                                ></v-text-field>
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
                                <v-btn @click="editRecord(item)" icon>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                        <v-pagination
                            v-model="page"
                            :length="pageCount"
                            :total="10"
                            color="primary"
                        ></v-pagination>
                    </v-container>
                </v-card>
            </v-lazy>
        </v-container>
        <v-dialog v-model="dialog" width="500" persistent>
            <v-card>
                <v-toolbar color="primary" dark>
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
                                    hide-details
                                    label="Room Description"
                                    :rules="[v => !!v || 'Room Description is required']"
                                    @keypress.enter="saveRecord(editBeds)"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions>    
                    <v-spacer></v-spacer>
                    <v-btn @click="clearVariables()">Cancel</v-btn>
                    <v-btn @click="saveRecord(editRooms)"><span>{{editMode ? 'Update' : 'Save'}}</span></v-btn>
                </v-card-actions> 
            </v-card>
        </v-dialog>
        <v-fab-transition>
            <v-btn
                color="primary"
                @click="dialog = !dialog"
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

        this.clearVariables()

    },
    methods: {
        editRecord(data){
           Object.assign(this.editRooms,data)
           this.dialog=!this.dialog
           this.editMode=true
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
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                this.clearVariables()
                this.loadRoams()
            }
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