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
                        <v-row dense justify="center">
                                <v-col cols="12" md="3" sm="3">
                                    <v-select    
                                    v-model="selectedtype"                                 
                                    :items="itemstype"
                                    label="Type"
                                    outlined
                                    dense
                                    hide-details
                                    @change="consumptiontype()"
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
                                        v-model="cubickilowatt"
                                        outlined
                                        dense
                                        small
                                        :label="cubickilowatt ==10 ?  'Less Free M3':'Less Free KW'"
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
                                        disabled
                                        label="Consumption"                            
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="2">
                                    <v-text-field                                    
                                        outlined
                                        dense
                                        small
                                        hide-details
                                        disabled
                                        label="Per KW / M3:"                            
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="2">
                                    <v-text-field
                                        outlined
                                        dense
                                        small
                                        hide-details
                                        disabled
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
                                    disabled
                                    label="Amount/Head"                            
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions dense >
                    <v-spacer></v-spacer>
                    <v-btn width="120"  >Cancel</v-btn>
                    <v-btn width="120">Save</v-btn>
                </v-card-actions>
            </v-card>            
        </v-container>
        <v-container>
            <v-card outlined>
                <v-container>
                    <v-data-table 
                        :headers="headers"
                        hide-default-footer
                    ></v-data-table>
                </v-container>
            </v-card>
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
            headers:[
                {text:'Payroll Date',value:'PayrollDate'},
                {text:'Previous Reading',value:'PrevReading'},
                {text:'Latest Reading',value:'LatestReading'},
                {text:'Payroll Date',value:'PayrollDate'},
                {text:'Consumption',value:'TotalConsumption'},
                {text:'Amount/Room',value:'TotalKWM3'},
                {text:'Amount/Head',value:'TotalConsumption'},
                {text:'Actions',value:'Actions'},
            ],
            itemstype:[
                {text:'Electricity',value:'80'},
                {text:'Water',value:'10'}
            ],
            selectedtype:'10',            
            page:1,
            pagecount:0,
            loading:false,
            cubickilowatt:"",
            
        }
    },
    created() {
        this.consumptiontype()
    },
    methods: {
        consumptiontype(){
            this.cubickilowatt=this.selectedtype
        }
    }
}
</script>