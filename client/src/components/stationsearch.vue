<template>
    <v-dialog v-model="listDialog" width="900" persistent>
        <v-card>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>Station Search</v-toolbar-title>
            </v-toolbar>
            <v-container>
                <v-data-table
                    v-model="selectedEmployee"
                    :headers="headers"
                    :items="station"
                    :single-select="true"
                    :loading="loading"
                    loading-text="Loading data. . . Please Wait"
                    item-key="EMPLCODE"
                    show-select
                    dense
                ></v-data-table>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="listDialog = !listDialog" :disabled="loading" text>Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['dialog', 'emplcode'],
    data() {
        return {
            loading: true,
            listDialog: false,
            station: [],
            selectedEmployee: [],
            headers: [
                {text: 'Code', value: 'EMPLCODE'},
                {text: 'Name', value: 'EMPNAME'},
                {text: 'Department', value: 'DEPTDESC'},
                {text: 'Section', value: 'SECTIONDESC'},
                {text: 'Team', value: 'TEAMDESC'},
            ]
        }
    },
    mounted() {
        this.loadStation()
    },
    methods: {
        loadStation() {
            this.loading = true
            this.axios.post(`${this.api_HRIS}/ora_stationsearch.php`).then(res => {
                this.station = res.data
                this.loading = false
            })
        },
    },
    watch: {
        selectedEmployee(val) {
            this.$emit('update:emplcode', val[0].EMPLCODE)
        },
        dialog() {
            this.listDialog = true
        }
    }
}
</script>