<template>
    <modal 
        name="stationsearch" 
        :adaptive="true"
        :draggable="true" 
        :resizable="true" 
        :reset="true" 
        height="auto" 
        width="900px"
        @before-open="loadStation()"
    >
        <v-toolbar color="primary" dark>
            <v-toolbar-title>Station</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="searchData"
                label="Search. . ."
                append-icon="mdi-magnify"
                hide-details
                outlined
                dense
            ></v-text-field>
        </v-toolbar>
        <v-container fluid>
            <v-data-table
                v-model="selectedEmployee"
                :headers="headers"
                :items="filterStation"
                :search="searchData"
                :single-select="true"
                :items-per-page="5"
                :page.sync="page"
                @click:row="selectEmployeeCode"
                @page-count="pageCount = $event"
                item-key="EMPLCODE"
                hide-default-footer
                show-select
            ></v-data-table>
            <v-pagination
                v-model="page"
                :length="pageCount"
                :total-visible="10"
                :color="themeColor == '' ? '#1976d2' : themeColor"
            ></v-pagination>
        </v-container>
        <v-card-actions>
            <v-subheader class="font-weight-bold">Total Record(s): {{ filterStation.length }}</v-subheader>
            <v-spacer></v-spacer>
            <v-btn class="pa-4" @click="$modal.hide('stationsearch')" text>Close</v-btn>
        </v-card-actions>
    </modal>
</template>

<script>
export default {
    props: ['code', 'company', 'searchStation'],
    data() {
        return {
            companyName: null,
            searchData: null,
            pageCount: 0,
            page: 1,
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
        
    },
    computed: {
        filterStation() {
            return this.station.filter(rec => {
                return rec.SHORTNAME.includes(this.companyName)
            }).sort((a, b) => a.EMPLCODE - b.EMPLCODE)
        }
    },
    methods: {
        async loadStation() {
            let companyInfo = this.getCompanyInformation(this.company)
            this.companyName = companyInfo.shortname
            this.station = await this.handleSelectData()
        },
        selectEmployeeCode(data) {
            this.selectedEmployee = []
            this.selectedEmployee.push(data)
            this.$emit('update:code', data.EMPLCODE)
            this.searchStation(data.EMPLCODE)
        }
    },
}
</script>