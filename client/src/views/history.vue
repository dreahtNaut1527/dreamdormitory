<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <v-toolbar color="grey lighten-2" flat>
                <v-toolbar-title>History</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon>mdi-history</v-icon>
            </v-toolbar>
            <v-card flat>
                <v-container fluid>
                    <v-row dense>
                        <v-col cols="12" md="4">
                            <v-card outlined>
                                <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>Date Range</v-system-bar>
                                <v-container fluid>
                                    <v-row align="center" dense>
                                        <v-col v-for="(date, i) in dateRange" :key="i">
                                            <datepicker :menu="date.dialog" :dateValue.sync="date.value" :dateLabel="date.text" />
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                        <v-col cols="12" :md="selectedOptions == 0 ? 8 : 4">
                            <v-card outlined>
                                <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>Filter</v-system-bar>
                                <v-container fluid>
                                    <v-select
                                        v-model="selectedOptions"
                                        :items="options"
                                        :color="themeColor == '' ? '#1976d2' : themeColor"
                                        label="Category"
                                        outlined
                                        dense
                                        hide-details
                                    ></v-select>
                                </v-container>
                            </v-card>
                        </v-col>
                        <v-col v-if="selectedOptions != 0" cols="12" md="4">
                            <v-card height="100%" outlined>
                                <v-system-bar :color="themeColor == '' ? '#1976d2' : themeColor" dark>Types</v-system-bar>
                                <v-container fluid>
                                    <v-radio-group class="mt-0" v-model="selectedBilliongOptions" hide-details dense row>
                                        <v-radio
                                            v-for="(item, i) in billingTypes" :key="i"
                                            :color="themeColor == '' ? '#1976d2' : themeColor"
                                            :label="item.text"
                                            :value="item.value"
                                        ></v-radio>
                                    </v-radio-group>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="pa-4 mx-2" text>Clear</v-btn>
                    <v-btn class="pa-4" :color="themeColor == '' ? '#1976d2' : themeColor" dark>Export</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-main>
</template>


<script>
import datepicker from '@/components/datepicker'

export default {
    data() {
        return {
            selectedOptions: 0,
            selectedBilliongOptions: 0,
            billingTypes: [],
            dateRange: [
                {text: 'Date From', dialog: false, value: this.moment().startOf('month').format('YYYY-MM-DD')},
                {text: 'Date To', dialog:false, value: this.moment().endOf('month').format('YYYY-MM-DD')}
            ],
            options: [
                {text: 'Tenants', value: 0},
                {
                    text: 'Billings', 
                    value: 1,
                    items: [
                        {text: 'Electricity', value: 0},
                        {text: 'Water', value: 1},
                        {text: 'Rentals', value: 2},
                    ]
                }
            ],
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'History', disabled: true, href: '#'}
            ]
        }
    },
    components: {
        datepicker
    },
    watch: {
        selectedOptions(val) {
            this.billingTypes = this.options[val].items
        }
    }
}
</script>