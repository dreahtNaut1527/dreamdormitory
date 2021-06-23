<template>
    <v-dialog v-model="detailsDialog" width="400" persistent>
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title class="caption">Details</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="editRecord()" v-on="on" v-bind="attrs" icon><v-icon :color="themeColor == '' ? '#1976d2' : themeColor" large>mdi-pencil-box</v-icon></v-btn>
                    </template>
                    <span>Edit</span>
                </v-tooltip>
            </v-toolbar>
            <v-container fluid>
                <v-row align="center" justify="center">
                    <v-col class="text-center" cols="12" md="12" sm="12">
                        <v-avatar size="156">
                            <v-img :src="`${photo}/${details.EmployeeCode}.jpg`"></v-img>
                        </v-avatar>
                    </v-col>
                </v-row>
                <v-card class="mt-5" outlined>
                    <v-row align="center" justify="center" dense>
                        <v-col class="mb-n6" cols="12" md="12" sm="12">
                            <v-subheader>
                                <div class="font-weight-bold">Code:</div>
                                <v-spacer></v-spacer>
                                {{details.EmployeeCode}}
                            </v-subheader>
                        </v-col>
                        <v-col class="mb-n6" cols="12" md="12" sm="12">
                            <v-subheader>
                                <div class="font-weight-bold">Name:</div>
                                <v-spacer></v-spacer>
                                {{details.EmployeeName}}
                            </v-subheader>
                        </v-col>
                        <v-col class="mb-n6" cols="12" md="12" sm="12">
                            <v-subheader>
                                <div class="font-weight-bold">Department:</div>
                                <v-spacer></v-spacer>
                                {{details.Department}}
                            </v-subheader>
                        </v-col>
                        <v-col class="mb-n6" cols="12" md="12" sm="12">
                            <v-subheader>
                                <div class="font-weight-bold">Section:</div>
                                <v-spacer></v-spacer>
                                {{details.Section}}
                            </v-subheader>
                        </v-col>
                        <v-col class="mb-n6" cols="12" md="12" sm="12">
                            <v-subheader>
                                <div class="font-weight-bold">Team:</div>
                                <v-spacer></v-spacer>
                                {{details.Team}}
                            </v-subheader>
                        </v-col>
                        <v-col class="mb-n6" cols="12" md="12" sm="12">
                            <v-subheader>
                                <div class="font-weight-bold">Move-In:</div>
                                <v-spacer></v-spacer>
                                {{details.MoveInDate}}
                            </v-subheader>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-subheader>
                                <div class="font-weight-bold">Move-Out:</div>
                                <v-spacer></v-spacer>
                                {{details.MoveOutDate}}
                            </v-subheader>
                        </v-col>
                    </v-row>
                </v-card>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="caption" @click="detailsDialog = !detailsDialog" text>Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['dialog', 'details'],
    data() {
        return {
            detailsDialog: false
        }
    },
    methods: {
        editRecord() {
            this.$router.push({name: 'tenantedit', query: {code: this.details.EmployeeCode}})
        }
    },
    watch: {
        dialog() {
            this.detailsDialog = true
        }
    }
}
</script>