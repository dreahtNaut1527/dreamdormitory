<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container>
            <v-card outlined>
                <v-container>
                    <v-list>
                        <v-list-item>
                            <v-list-item-avatar size="84">
                                <v-img :src="`${photo}/${dormData.EmployeeCode}.jpg`" />
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold title">{{ dormData.EmployeeCode }}</v-list-item-title>
                                <v-list-item-subtitle>{{ dormData.EmployeeName }}</v-list-item-subtitle>
                                <v-list-item-subtitle>{{ dormData.Department }}</v-list-item-subtitle>
                                <v-list-item-subtitle>{{ dormData.BuildingDesc }} - Room {{zeroPad(dormData.RoomNo, 3)}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Materials / Appliances</v-toolbar-title>
                    </v-toolbar>
                    <v-data-table
                        :headers="headers" 
                        :items="filterDormitoryPassDetails"
                        :search="searchTable"
                        :page.sync="page"
                        @page-count="pageCount = $event"
                        item-key="DetailNo"
                        hide-default-footer
                        show-select
                    >
                        <!-- <template v-slot:[`item.actions`]="{ item }">
                            <v-btn @click="editDormPass(item)" icon><v-icon>{{ item.DormitoryPassCode ? 'mdi-eye' : 'mdi-pencil' }}</v-icon></v-btn>
                        </template> -->
                        <template v-slot:no-data>
                            <v-row align="center" justify="center">
                                <v-col cols="12" md="12">
                                    <v-sheet color="transparent" height="450">
                                        <v-container class="fill-height">
                                            <v-card-text class="font-weight-bold text-center grey--text display-1">No data found</v-card-text>
                                        </v-container>
                                    </v-sheet>
                                </v-col>
                            </v-row>
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
        </v-container>
        <v-dialog v-model="dialog" width="600" persistent>
            <v-card>
                <v-toolbar color="primary" dark>
                    <v-toolbar-title>{{ editMode ? 'Edit Material' : 'New Material' }}</v-toolbar-title>
                </v-toolbar>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-container>
                        <v-row align="center" justify="center" dense>
                            <v-col cols="12" md="7">
                                <v-text-field
                                    v-model="dormData.Destination"
                                    label="Destination"
                                    :rules="[v => !!v || 'This field is required']"
                                    :hide-details="valid"
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="5">
                                <v-radio-group v-model="dormData.Category" row>
                                    <v-radio
                                        v-for="(item, i) in categoryList" :key="i"
                                        :label="item.text"
                                        :value="item.value"
                                    ></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <datepicker :menu="encodeDialog" :dateValue.sync="dormData.EncodedDate" dateLabel="Encoded" />
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <datepicker :menu="validDialog" :dateValue.sync="dormData.ValidDate" dateLabel="Validity" />
                            </v-col>
                            <v-col cols="12" md="9" sm="9">
                                <v-text-field
                                    v-model="itemDetails.ItemName"
                                    label="Item Name"
                                    :rules="[v => !!v || 'This field is required']"
                                    :hide-details="valid"
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3" sm="3">
                                <v-text-field
                                    v-model="itemDetails.Quantity"
                                    label="Quantity"
                                    type="number"
                                    :rules="[v => !!v || 'This field is required']"
                                    :hide-details="valid"
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-textarea
                                    v-model="itemDetails.Specification"
                                    label="Specification"
                                    :rules="[v => !!v || 'This field is required']"
                                    :hide-details="valid"
                                    outlined
                                    dense
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-textarea
                                    v-model="itemDetails.Remarks"
                                    label="Remarks"
                                    :rules="[v => !!v || 'This field is required']"
                                    :hide-details="valid"
                                    outlined
                                    dense
                                ></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="clearVariables()" class="mx-3" text>Cancel</v-btn>
                    <v-btn @click="saveRecord()" color="primary" dark>Save</v-btn>
                </v-card-actions>
                {{dormData}}
            </v-card>
        </v-dialog>
        <v-fab-transition>
            <v-btn @click="newRecord()" color="primary" fixed bottom right large dark fab>
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-fab-transition>
        <v-overlay :value="loading">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-main>
</template>

<script>
import datepicker from './datepicker'

export default {
    props: ['dormData'],
    data() {
        return {
            valid: true,
            dialog: false,
            loading: false,
            editMode: false,
            validDialog: false,
            encodeDialog: false,
            searchTable: '',
            destination: '',
            pageCount: 0,
            page: 1,
            items: [],
            dormitoryPassDetails: [],
            categoryList: [
                {text: 'Incoming', value: false},
                {text: 'Outgoing', value: true}
            ],
            itemDetails: {
                ItemName: null,
                Specification: null,
                Quantity: 0,
                Remarks: null
            },
            headers: [
                {text: 'Item Name', value:'ItemName'},
                {text: 'Specification', value:'Specification'},
                {text: 'Quantity', value:'Quantity'},
                {text: 'Remarks', value:'Remarks'}
            ],
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Dormitory Pass', disabled: false, href: '/dreamdormitory/dormpass'},
                {text: 'Details', disabled: true, href: '#'}
            ]
        }
    },
    mounted() {
        this.loading = true
        this.loadMasterMaintenance('dormpassdetails').then(res => {
            this.dormitoryPassDetails = res.data || []
            this.loading = false
        })
    },
    computed: {
        filterDormitoryPassDetails() {
            return this.dormitoryPassDetails.filter(rec => {
                return rec.DormitoryPassCode.includes(this.dormData.DormitoryPassCode || '')
            })
        }
    },
    methods: {
        newRecord() {
            this.dialog = true
        },
        saveRecord() {
            // let body = {
            //     procedureName: 'ProcDormitoryPassHeader',
            //     values: [
            //         data.BuildingId,
            //         data.BuildingDesc,
            //         data.BuildingAddress,
            //         this.hrisUserInfo.USERACCT,
            //         1
            //     ]
            // }
            // if(this.$refs.form.validate()) {
            //     this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
            //     this.clearVariables()
            //     this.loadBuildings()
            // }
        },
        clearVariables() {
            this.dialog = false
            this.itemDetails = {
                ItemName: null,
                Specification: null,
                Quantity: 0,
                Remarks: null
            }
            this.loading = true
            this.loadMasterMaintenance('dormpassdetails').then(res => {
                this.dormitoryPassDetails = res.data || []
                this.loading = false
            })
            this.$refs.form.resetValidation()
        }
    },
    components: {
        datepicker
    }
}
</script>