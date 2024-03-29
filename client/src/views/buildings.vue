<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
                <v-card outlined>
                    <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" flat dark>
                        <v-toolbar-title>Buildings</v-toolbar-title>
                    </v-toolbar>
                    <v-container fluid>
                        <v-row align="center" justify="end" no-gutters>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="searchTable"
                                    placeholder="Search Name or Address"
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
                            :items="buildings"
                            :loading="loading"
                            :search="searchTable"
                            :page.sync="page"
                            loading-text="Loading Data. . .Please Wait"
                            @page-count="pageCount = $event"
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
                    <v-subheader class="font-weight-bold">Total Record(s): {{ buildings.length }}</v-subheader>
                </v-card>
            </v-lazy>
        </v-container>
        <modal name="building" :adaptive="true" :draggable="true" :focusTrap="true" :reset="true" height="auto" @before-close="clearVariables()">
            <v-card outlines>
                <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                    <v-toolbar-title>{{editMode ? 'Edit Record' : 'Create New'}}</v-toolbar-title>
                </v-toolbar>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-container>
                        <v-row align="center" justify="center" no-gutters dense>
                            <v-col cols="12" md="12">
                                <v-text-field
                                    v-model="editBuildings.BuildingDesc"
                                    :rules="[v => !!v || 'field is required']"
                                    @keypress.enter="saveRecord(editBuildings)"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    label='Building Name'
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-textarea
                                    v-model="editBuildings.BuildingAddress"
                                    :rules="[v => !!v || 'field is required']"
                                    @keypress.enter="saveRecord(editBuildings)"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    label='Building Address'
                                    outlined
                                    dense
                                ></v-textarea>  
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="px-5" @click="$modal.hide('building')" text>Cancel</v-btn>
                    <v-btn class="px-5" @click="saveRecord(editBuildings)" :color="themeColor == '' ? '#1976d2' : themeColor" dark>Save</v-btn>
                </v-card-actions>
            </v-card>   
        </modal>
        <v-fab-transition>
            <v-btn
                :color="themeColor == '' ? '#1976d2' : themeColor"
                @click="$modal.show('building')"
                fixed
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
export default {
    data() {
        return {
            valid: true,
            dialog: false,
            loading: true,
            editMode: false,
            searchTable: '',
            pageCount: 0,
            page: 1,
            buildings: [],
            editBuildings: {
                BuildingId: '',
                BuildingDesc: '',
                BuildingAddress: ''
            },
            headers: [
                {text: 'Building', value: 'BuildingDesc'},
                {text: 'Address', value: 'BuildingAddress'},
                {text: 'Created', value: 'CreatedDate'},
                {text: 'Updated', value: 'UpdatedDate'},
                {text: 'Actions', value: 'actions'},
            ],
            breadCrumbsItems: [ 
                {text: 'Maintenance', disabled: false, href: '#'},
                {text: 'Buildings', disabled: true, href: '#'}
            ]
        }
    },
    sockets: {
        connect() {
            setTimeout(() => {
                this.loadBuildings()
            }, 1500);
        },
        showNotifications() {
            setTimeout(() => {
                this.loadBuildings()
            }, 1500);
        }
    },
    created() {
        this.loadBuildings()
    },
    methods: {
        loadBuildings() {
            this.loading = true
            this.buildings = []
            this.loadMasterMaintenance('buildings').then(res => {
                this.buildings = res.data
                this.loading = false
            })
        },
        editRecord(data) {
            Object.assign(this.editBuildings, data)
            this.editMode = true
            this.dialog = !this.dialog
            this.$modal.show('building')
        },
        saveRecord(data) {
            let body = {
                procedureName: 'ProcBuildings',
                values: [
                    data.BuildingId,
                    data.BuildingDesc,
                    data.BuildingAddress,
                    this.hrisUserInfo.USERACCT,
                    1
                ]
            }
            if(this.$refs.form.validate()) {
                this.handleQuestionMessage('', 'Do you want to save data?', 'Save', null, 'question').then(result => {
                    if(result.isConfirmed) {
                        this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                        if(this.isEditMode) {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} updated a record`)
                        } else {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} added a new building`)
                        }
                        this.clearVariables()
                        this.loadBuildings()
                        this.$toast.success('Record saved!', {
                            position: 'top-right',
                            timeout: 3000,
                            closeOnClick: true,
                            pauseOnFocusLoss: true,
                            pauseOnHover: true,
                            draggable: true,
                            icon: true
                        })
                        this.$modal.hide('building')
                    }
                }) 
            }
        },
        handleExportExcel() {
            let data = []
            this.handleQuestionMessage('', 'Export to Excel?', 'Export', null, 'question').then(result => {
                if(result.isConfirmed) {
                    this.buildings.forEach(rec => {
                        data.push({
                            Building: rec.BuildingDesc,
                            Address: rec.BuildingAddress,
                            Created: this.moment(rec.CreatedDate).format('YYYY-MM-DD')
                        })
                    })
                    this.exportExcel(data, 'Buildings')
                }
            })
        },
        clearVariables() {
            this.editMode = false
            this.dialog = !this.dialog
            this.editBuildings = {
                BuildingId: '',
                BuildingDesc: '',
                BuildingAddress: ''
            }
            this.$refs.form.resetValidation()
        }
    }
}
</script>