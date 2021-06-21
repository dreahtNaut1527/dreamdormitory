<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container >
            <v-toolbar color="primary" dark>
                <v-toolbar-title>
                    <span>Payroll Date : </span>
                    <span>June 31, 2021</span>
                </v-toolbar-title>
            </v-toolbar>           
            <v-card outlined>
                <v-form>
                    <v-container fluid>
                        <v-row dense justify="left">
                                <v-col cols="12" md="3" sm="3">
                                    <v-select                                     
                                    :items="itemstype"
                                    label="Outlined style"
                                    outlined
                                    dense
                                    hide-details
                                    ></v-select>
                                </v-col>
                            <v-col cols="12" md="3" sm="3">
                                    <v-autocomplete 
                                        outlined
                                        chip
                                        small-chips
                                        dense
                                        label="Building"
                                        hide-details 
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-autocomplete 
                                        outlined
                                        chip
                                        small-chips
                                        dense
                                        label="Floor"
                                        hide-details
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-autocomplete 
                                        outlined
                                        chip
                                        small-chips
                                        dense
                                        label="Room"
                                        hide-details
                                    ></v-autocomplete>
                                </v-col> 

                                <v-col cols="12" md="3" sm="3">
                                    <v-text-field
                                        outlined
                                        dense
                                        label="Previous Reading"
                                        hide-details
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-text-field
                                        outlined
                                        dense
                                        label="Date"
                                        hide-details
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-text-field
                                        outlined
                                        dense
                                        label="Latest Reading"
                                        hide-details
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3">
                                    <v-text-field
                                        outlined
                                        dense
                                        label="Date"
                                        hide-details
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field
                                        outlined
                                        dense
                                        small
                                        label="Less Free KW / M3:"
                                        disabled 
                                        hide-details
                                        value="80 KW / 10m3"                               
                                    ></v-text-field>
                                </v-col>   
                                <v-col cols="12" md="3">
                                    <v-text-field
                                        outlined
                                        dense
                                        small
                                        hide-details
                                        label="Consumption"                            
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="2">
                                    <v-text-field
                                        outlined
                                        dense
                                        small
                                        hide-details
                                        label="Per KW / M3:"                            
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="2">
                                    <v-text-field
                                        outlined
                                        dense
                                        small
                                        hide-details
                                        label="Amount/Room"                            
                                    ></v-text-field>
                                </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field
                                    outlined
                                    dense
                                    small
                                    small-chips
                                    hide-details
                                    label="Amount/Head"                            
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions dense>
                    <v-spacer></v-spacer>
                    <v-btn>Cancel</v-btn>
                    <v-btn>Save</v-btn>
                </v-card-actions>
            </v-card>            
        </v-container>
        <v-container>
            <v-data-table hide-default-footer></v-data-table>
        </v-container>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Consumption', disabled: true, href: '#'}
            ],
            itemstype:['Electricity','Water']
        }
    },
    created() {

    },
    methods: {
        
    }
}
</script>