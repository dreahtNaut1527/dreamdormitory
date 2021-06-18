<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-subheader>Tenant Details</v-subheader>
        <v-container>
            <v-row justify="center" dense>
                <v-col class="text-center" cols="12" md="2">
                    <v-avatar size="126">
                        <v-img :src="`${photo}/${emplcode}.jpg`" />
                    </v-avatar>
                    <v-list dense>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold subtitle-1">{{ editTenantDetails.EmployeeCode }} </v-list-item-title>
                                <v-list-item-subtitle class="caption">{{ editTenantDetails.EmployeeName }} </v-list-item-subtitle>
                                <v-list-item-subtitle class="caption">{{ editTenantDetails.Designation }} </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="12" md="10">
                    <v-card outlined>
                        <v-container fluid>
                            <v-row dense>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Employee Code:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.EmployeeCode"
                                        hide-details
                                        outlined
                                        dense   
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Employee Name:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.EmployeeName"
                                        hide-details
                                        outlined
                                        readonly
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Department:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.Department"
                                        hide-details
                                        outlined
                                        readonly
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Section:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.Section"
                                        hide-details
                                        outlined
                                        readonly
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-subheader>Team:</v-subheader>
                                </v-col>
                                <v-col cols="12" md="9" sm="9">
                                    <v-text-field
                                        v-model="editTenantDetails.Team"
                                        hide-details
                                        outlined
                                        readonly
                                        dense
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="mx-3" text>Cancel</v-btn>
                        <v-btn color="primary" dark>Save</v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            emplcode: null,
            isEditMode: false,
            editTenantDetails: {},
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Tenants', disabled: false, href: '/dreamdormitory/tenants'},
                {text: 'Details', disabled: true, href: '#'}
            ]
        }
    },
    created() {
        this.emplcode = this.$route.query.code || null
        this.isEditMode = this.emplcode ? true : false
    },
    mounted() {
        this.loadMasterMaintenance('tenants').then(res => {
            this.editTenantDetails = res.data[0]
            this.stationSearch(this.editTenantDetails.EmployeeCode).then(res => {
                Object.assign(this.editTenantDetails, {
                    EmployeeName: res.data[0].EMPNAME || null,
                    Department: res.data[0].DEPTDESC || null,
                    Section: res.data[0].SECTIONDESC || null,
                    Team: res.data[0].TEAMDESC || null,
                    Designation: res.data[0].DESIGDESC || null
                })
                this.$forceUpdate()
            })
        })
    },
    computed: {
        filterTenants() {
            return this.editTenantDetails.filter(rec => {
                return rec.EmployeeCode.includes(this.emplcode)
            })
        }
    },
    methods: {

    }
}
</script>