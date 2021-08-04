<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" flat dark>
                        <v-toolbar-title>Floors</v-toolbar-title>
                    </v-toolbar>
                    <v-container fluid>
                        <v-row align="center" justify="end">
                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="searchTable"
                                    placeholder="Search Floors"
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
                        <v-divider class="mt-4" ></v-divider>
                        <v-data-table
                            :headers="headers"
                            :items="floors"
                            :loading="loading"
                            :search="searchTable"
                            :page.sync="page"
                            @page-count="pageCount = $event"
                            loading-text="Loading Data...Please Wait Outside"
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
                            :total-visible="10"
                            :color="themeColor == '' ? '#1976d2' : themeColor"
                        ></v-pagination>
                    </v-container>
                    <v-subheader class="font-weight-bold">Total Record(s): {{ floors.length }}</v-subheader>
                </v-card>
            </v-lazy>
        </v-container>
        <modal name="floor" :adaptive="true" :draggable="true" :focusTrap="true" :reset="true" height="auto" @before-close="clearVariables()">
            <v-card>
                <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                    <v-toolbar-title>
                        <span>{{editMode ? 'Edit Record' : 'Create New'}}</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-form ref='form' v-model="valid" lazy-validation>
                    <v-container>
                        <v-row align="center" justify="center">
                            <v-col cols="12" md="12">
                                <v-text-field
                                    v-model="editFloors.FloorDesc"
                                    outlined
                                    dense
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    :rules="[v => !!v || 'Floor Description is required']"
                                    label="Floor Description"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="px-5" @click="$modal.hide('floor')" text>Cancel</v-btn>
                    <v-btn class="px-5" @click="saveRecord(editFloors)" :color="themeColor == '' ? '#1976d2' : themeColor" dark>Save</v-btn>
                </v-card-actions>
            </v-card>
        </modal>
        <v-fab-transition>
            <v-btn
                :color="themeColor == '' ? '#1976d2' : themeColor"
                @click="$modal.show('floor')"
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
                {text: 'Floors', disabled: true, href: '#'}
            ],
            headers:[
                {text:"Floor NO",value:"FloorNo"},
                {text:"Floor Description",value:"FloorDesc"},
                {text:"Created",value:"CreatedDate"},
                {text:"Updated",value:"UpdatedDate"},
                {text:"Actions",value:"actions"},
            ],
            numSuffix:{1:'st',2:'nd',3:'rd',th:'th'},
            editFloors:{
                FloorNo:"",
                FloorDesc:"",
            },
            floors:[],
            searchTable:"",
            loading:false,
            dialog:false,
            editMode:false,
            pageCount:0,
            page:1,
            floorno:0,
            valid:true,
        }
    },
    created() {
        // Load Floors
        this.loadMasterMaintenance('floors').then(res => {
            this.floors=[]
            this.floors = res.data                  
        })
    },
    methods: {
        editRecord(data){
            this.editMode =true
            this.dialog=!this.dialog
            Object.assign(this.editFloors,data)
            this.$modal.show('floor')
        },
        saveRecord(data) {
            let body = {
                procedureName: 'ProcFloors',
                values: [
                    data.FloorNo,
                    data.FloorDesc,
                    this.hrisUserInfo.USERACCT,
                    1
                ]
            }
            if (this.$refs.form.validate()) {
                this.handleQuestionMessage('', 'Do you want to save data?', 'Save', null, 'question').then(result => {
                    if(result.isConfirmed) {
                        this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                        if(this.editMode) {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} updated a record`)
                        } else {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} added a new floor`)
                        }
                        this.clearVariables()
                        this.$toast.success('Record saved!', {
                            position: 'top-right',
                            timeout: 3000,
                            closeOnClick: true,
                            pauseOnFocusLoss: true,
                            pauseOnHover: true,
                            draggable: true,
                            icon: true
                        })
                        this.$modal.hide('floor')
                    }
                })
            }
        },
        handleExportExcel() {
            let data = []
            this.handleQuestionMessage('', 'Export to Excel?', 'Export', null, 'question').then(result => {
                if(result.isConfirmed) {
                    this.floors.forEach(rec => {
                        data.push({
                            No: rec.FloorNo,
                            Room: `Floor ${rec.FloorNo}`,
                            Created: this.moment(rec.CreatedDate).format('YYYY-MM-DD')
                        })
                    })
                    this.exportExcel(data, 'Floor')
                }
            })
        },
        clearVariables() {
            this.editMode = false
            this.dialog = false
            this.loading=false
            this.editFloors = {
                FloorNo: '',
                FloorDesc: '',
            }
            this.loadMasterMaintenance('floors').then(res => {
                this.floors=[]
                this.floors = res.data                  
            })
            this.$refs.form.resetValidation()
        }
    }
}
</script>