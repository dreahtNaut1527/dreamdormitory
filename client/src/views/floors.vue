<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container>
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar color="primary" flat dark>
                        <v-toolbar-title>Floors</v-toolbar-title>
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
                                <v-btn @click="editRecord(item)" icon>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
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
        <v-dialog v-model="dialog" width="500" persistent>
            <v-card>
                <v-toolbar color="primary" dark>
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
                    <v-btn @click="clearVariables()">
                        Cancel
                    </v-btn>
                    <v-btn @click="saveRecord(editFloors)">
                        {{editMode? 'Update' : 'Save'}}
                    </v-btn>
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
        this.clearVariables()
    },
    methods: {
        editRecord(data){
            this.editMode =true
            this.dialog=!this.dialog
            Object.assign(this.editFloors,data)
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
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                this.clearVariables()
            }
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