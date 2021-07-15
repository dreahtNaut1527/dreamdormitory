<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <!-- Transition upon opening -->
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                        <v-toolbar-title>Beds</v-toolbar-title>
                    </v-toolbar>
                    <v-container fluid>
                        <v-row align="center" justify="end">
                            <v-col cols=12 md="4">
                                <v-text-field
                                    v-model="searchTable"
                                    hide-details
                                    outlined
                                    dense
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    placeholder="Search Beds"
                                    append-icon="mdi-magnify"
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
                            :items="beds"
                            :search="searchTable"
                            :page.sync="page"
                            :loading="loading"
                            @page-count="pageCount = $event"
                            hide-default-footer
                            
                        >
                            <template v-slot:[`item.Actions`]='{ item }'>
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
                </v-card>
            </v-lazy>
        </v-container>
        <v-dialog v-model="dialog" width="500" persistent>
            <v-card>
                <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                    <v-toolbar-title>
                        {{editMode ? 'Edit Record' : 'Create New'}}
                    </v-toolbar-title>
                </v-toolbar>
                <v-form ref="form" v-model="valid" lazy-validation>
                     <v-container>
                    <v-row align="center" justify="center">
                        <v-col cols="12" md="12">
                            <v-text-field
                                outlined
                                v-model="editBeds.BedDesc"
                                dense
                                :color="themeColor == '' ? '#1976d2' : themeColor"
                                :rules="[v => !!v || 'Bed Decription is required']"
                                label="Bed Decription"
                            ></v-text-field>
                        </v-col>  
                    </v-row>
                    </v-container>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="px-5" @click="clearVariables()" text>Cancel</v-btn>
                    <v-btn class="px-5" @click="saveRecord(editBeds)" :color="themeColor == '' ? '#1976d2' : themeColor" dark>Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-fab-transition>
            <v-btn
                :color="themeColor == '' ? '#1976d2' : themeColor"
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
                {text: 'Beds', disabled: true, href: '#'}
            ],
            headers:[
                {text:"No.", value:"BedNo"},
                {text:"Bed Description", value:"BedDesc"},
                {text:"Created", value:"CreatedDate"},
                {text:"Updated", value:"UpdatedDate"},
                {text:"Actions", value:"Actions"},
            ],
            editBeds:{
                BedNo: '',
                BedDesc: '',
            },
            beds:[],
            searchTable:'',
            page:1,
            pageCount:0,
            loading:false,
            editMode:false,
            dialog:false,
            valid:true,
        }
    },
    created() {
        // Load Beds
        this.loadMasterMaintenance('beds').then(res => {
            this.beds=[]
            this.beds = res.data
        })
    },

    methods: {
        editRecord(data){
            this.editMode=true       
            this.dialog= true 
            Object.assign(this.editBeds,data)
        },
        saveRecord(data) {
            let body = {
                procedureName: 'ProcBeds',
                values: [
                    data.BedNo,
                    data.BedDesc,
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
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} added a new bed`)
                        }
                        this.clearVariables()
                        this.handleToastMesaage().fire({icon: 'success', title: 'Record saved'})
                    }
                }) 
            }
        },
        handleExportExcel() {
            let data = []
            this.handleQuestionMessage('', 'Export to Excel?', 'Export', null, 'question').then(result => {
                if(result.isConfirmed) {
                    this.beds.forEach(rec => {
                        data.push({
                            No: rec.BedNo,
                            Bed: rec.BedDesc,
                            Created: this.moment(rec.CreatedDate).format('YYYY-MM-DD')
                        })
                    })
                    this.exportExcel(data, 'Beds')
                }
            })
        },
        clearVariables() {
            this.editMode = false
            this.dialog = false
            this.loading=false
            this.editBeds = {
                BedNo: '',
                BedDesc: '',
            }            
            this.loadMasterMaintenance('beds').then(res => {
                this.beds=[]
                this.beds = res.data
            })
            this.$refs.form.resetValidation()
        }
    }
}
</script>