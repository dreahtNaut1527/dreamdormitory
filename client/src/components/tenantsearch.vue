<template>
    <v-dialog v-model="listDialog" width="900" persistent>
        <v-card>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>Select Tenants</v-toolbar-title>
            </v-toolbar>
            <v-container>
                <v-data-table
                    v-model="selectedTenant"
                    :headers="headers"
                    :items="availableTenants"
                    :single-select="true"
                    item-key="EmployeeCode"
                    show-select
                    dense
                ></v-data-table>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="selectTenants()" text>Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['dialog', 'selectedTenants'],
    data() {
        return {
            listDialog: false,
            selectedTenant: [],
            availableTenants: [],
            headers: [
                {text: 'Code', value: 'EmployeeCode'},
                {text: 'Name', value: 'EmployeeName'},
                {text: 'Department', value: 'Department'},
                {text: 'Section', value: 'Section'},
                {text: 'Team', value: 'Team'},
                {text: 'Move-In', value: 'MoveInDate'},
                {text: 'Move-Out', value: 'MoveOutDate'}
            ]
        }
    },
    created() {

    },
    mounted() {
        this.loadMasterMaintenance('searchtenants').then(res => this.availableTenants = res.data)
    },
    methods: {
        selectTenants() {
            this.$emit('update:selectedTenants', this.selectedTenant)
            this.listDialog = false
        }
    },
    watch: {
        availableTenants(val) {
            val.forEach(rec => {
                this.axios.post(`${this.api_HRIS}/ora_stationsearch.php`, {emplcode: rec.EmployeeCode}).then(res => {
                    Object.assign(rec, {
                        EmployeeName: res.data[0].EMPNAME || null,
                        Department: res.data[0].DEPTDESC || null,
                        Section: res.data[0].SECTIONDESC || null,
                        Team: res.data[0].TEAMDESC || null,
                        Designation: res.data[0].DESIGDESC || null
                    })
                })
            })
        },
        dialog() {
            this.listDialog = true
        }
    }
}
</script>