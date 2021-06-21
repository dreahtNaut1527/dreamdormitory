<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container>
            <!-- Transition upon opening -->
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Beds</v-toolbar-title>
                    </v-toolbar>
                    <v-container>
                        <v-row align="center" justify="end">
                            <v-col cols=12 md="6">
                                <v-text-field
                                    v-model="searchTable"
                                    hide-details
                                    outlined
                                    dense
                                    placeholder="Search Beds"
                                    append-icon="mdi-magnify"
                                ></v-text-field>
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
                <v-toolbar color='primary' dark>
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
                                :rules="[v => !!v || 'Bed Decription is required']"
                                label="Bed Decription"
                            ></v-text-field>
                        </v-col>  
                    </v-row>
                    </v-container>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="clearVariables()">Cancel</v-btn>
                    <v-btn @click="saveRecord(editBeds)">{{editMode ? 'Update' : 'Save'}}</v-btn>
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
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                this.clearVariables()
            }
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