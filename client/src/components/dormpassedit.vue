<template>
    <div>
        <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
            <v-card outlined>
                <v-container fluid>
                    <v-list>
                        <v-list-item>
                            <v-list-item-avatar size="84">
                                <v-img :src="`${photo}/${dormData.EmployeeCode}.jpg`" />
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold title">{{ dormData.EmployeeCode }}</v-list-item-title>
                                <v-list-item-subtitle>{{ dormData.EmployeeName }}</v-list-item-subtitle>
                                <v-list-item-subtitle>{{ dormData.Department }} / {{ dormData.Section }}</v-list-item-subtitle>
                                <v-list-item-subtitle>{{ dormData.BuildingDesc }} - Room {{zeroPad(dormData.RoomNo, 3)}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" flat dark>
                        <v-toolbar-title>Materials / Appliances</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon><v-icon large>mdi-file-find</v-icon></v-btn>
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
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn @click="editRecord(item)" icon><v-icon>mdi-pencil</v-icon></v-btn>
                        </template>
                        <template v-slot:no-data>
                            <v-row align="center" justify="center">
                                <v-col cols="12" md="12">
                                    <v-sheet color="transparent" height="450">
                                        <v-container class="fill-height" fluid>
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
                        :color="themeColor == '' ? '#1976d2' : themeColor"
                    ></v-pagination>
                </v-container>
            </v-card>
        </v-lazy>
        <modal name="materials" :adaptive="true" :draggable="true" :focusTrap="true" :reset="true" height="auto" @before-close="clearVariables()">
            <v-card>
                <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" flat dark>
                    <v-toolbar-title>{{ editMode ? 'Edit Material' : 'New Material' }}</v-toolbar-title>
                </v-toolbar>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-container fluid>
                        <v-row align="center" justify="center" dense>
                            <v-col cols="12" md="7" sm="7">
                                <datepicker :menu="encodeDialog" :dateValue.sync="dormData.EncodedDate" dateLabel="Encoded" />
                            </v-col>
                            <v-col cols="12" md="5">
                                <v-radio-group v-model="dormData.Category" row>
                                    <v-radio
                                        v-for="(item, i) in categoryList" :key="i"
                                        :color="themeColor == '' ? '#1976d2' : themeColor"
                                        :label="item.text"
                                        :value="item.value"
                                    ></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field
                                    v-model="dormData.Destination"
                                    label="Destination"
                                    :rules="[v => !!v || 'This field is required']"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
                                    :hide-details="valid"
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <datepicker :menu="validDialog" :dateValue.sync="dormData.ValidDate" dateLabel="Validity" />
                            </v-col>
                            <v-col cols="12" md="9" sm="9">
                                <v-text-field
                                    v-model="itemDetails.ItemName"
                                    label="Item Name"
                                    :rules="[v => !!v || 'This field is required']"
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
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
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
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
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
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
                                    :color="themeColor == '' ? '#1976d2' : themeColor"
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
                    <v-btn @click="$modal.hide('materials')" class="mx-1 px-5" text>Cancel</v-btn>
                    <v-btn class="px-5" @click="saveRecord()" :color="themeColor == '' ? '#1976d2' : themeColor" dark>Save</v-btn>
                </v-card-actions>
            </v-card>
        </modal>
        <v-fab-transition>
            <v-btn @click="newRecord()" :color="themeColor == '' ? '#1976d2' : themeColor" fixed bottom right large dark fab>
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-fab-transition>
        <v-overlay :value="loading">
            <v-progress-circular
                indeterminate
                size="126"
                :color="themeColor == '' ? '#1976d2' : themeColor"
            ></v-progress-circular>
        </v-overlay>
    </div>
</template>

<script>
import datepicker from './datepicker'

export default {
    data() {
        return {
            valid: true,
            dialog: false,
            loading: false,
            editMode: false,
            validDialog: false,
            encodeDialog: false,
            dormPassCode: '',
            searchTable: '',
            destination: '',
            pageCount: 0,
            page: 1,
            items: [],
            dormData: [],
            dormitoryPassDetails: [],
            categoryList: [
                {text: 'Incoming', value: false},
                {text: 'Outgoing', value: true}
            ],
            itemDetails: {
                DetailNo: 0,
                ItemName: null,
                Specification: null,
                Quantity: 0,
                Remarks: null
            },
            headers: [
                {text: 'Item Name', value:'ItemName'},
                {text: 'Specification', value:'Specification'},
                {text: 'Quantity', value:'Quantity'},
                {text: 'Remarks', value:'Remarks'},
                {text: 'Actions', value:'actions'}
            ]
        }
    },
    created() {
        this.dormData = this.$route.query
        this.loading = true
        this.loadMasterMaintenance('dormpassdetails').then(res => {
            this.dormitoryPassDetails = res.data || []
            this.loading = false
            this.dormPassCode =  `RNTR - ${this.rightString(this.dormData.BuildingDesc, 1)}${this.zeroPad(this.dormData.RoomNo, 3)}${this.zeroPad(this.dormData.BedNo, 2)}`
            this.dormData.DormitoryPassCode = this.dormPassCode
        })
    },
    computed: {
        filterDormitoryPassDetails() {
            return this.dormitoryPassDetails.filter(rec => {
                return rec.DormitoryPassCode.includes(this.dormData.DormitoryPassCode)
            })
        }
    },
    methods: {
        handleDrag({ target, transform}) {
            target.style.transform = transform
        },
        newRecord() {
            this.$modal.show('materials')
        },
        saveRecord() {
            if(this.$refs.form.validate()) {
                this.handleQuestionMessage('', 'Do you want to save data?', 'Save', null, 'question').then(result => {
                    if(result.isConfirmed) {
                        this.saveDormitoryPassHDetails()
                        this.saveDormitoryPassHeader()
                        if(this.editMode) {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} updated a record`)
                        } else {
                            this.setNotifications(this.hrisUserInfo.USERACCT, `User: ${this.hrisUserInfo.USERACCT} added a new record`)
                        }
                        this.clearVariables()
                        this.handleToastMesaage().fire({icon: 'success', title: 'Record saved'})
                    }
                })
            }
        },
        editRecord(data) {
            this.editMode = true
            Object.assign(this.itemDetails, data)
            this.dialog = true
            this.$modal.show('materials')
        },
        saveDormitoryPassHeader() {
            let data = this.dormData
            let body = {
                procedureName: 'ProcDormitoryPassHeader',
                values: [
                    this.dormPassCode,
                    data.EmployeeCode,
                    data.EncodedDate,
                    data.Category ? 1 : 0,
                    data.Destination,
                    data.ValidDate,
                    this.hrisUserInfo.USERACCT,
                    this.moment().format('YYYY-MM-DD'),
                    this.hrisUserInfo.USERACCT,
                ]
            }
            this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
        },
        saveDormitoryPassHDetails() {   
            let data = this.itemDetails   
            let body = {
                procedureName: 'ProcDormitoryPassDetails',
                values: [
                    this.dormPassCode,
                    data.DetailNo,
                    data.ItemName,
                    data.Specification,
                    data.Quantity,
                    data.Remarks,
                    this.hrisUserInfo.USERACCT,
                ]
            }
            this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
        },
        clearVariables() {
            this.editMode = false
            this.dialog = false
            this.itemDetails = {
                DetailNo: 0,
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