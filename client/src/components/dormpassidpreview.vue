<template>
    <v-lazy :options="{ threshold: .5 }" min-height="200" transition="scroll-y-transition">
        <v-card>
            <v-toolbar :color="themeColor == '' ? '#1976d2' : themeColor" dark>
                <v-toolbar-title>Preview</v-toolbar-title>
            </v-toolbar>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :color="themeColor == '' ? '#1976d2' : themeColor" @click="printDormID()" :disabled="tenants.length == 0" dark>
                    Download<v-icon right>mdi-download</v-icon>
                </v-btn>
            </v-card-actions>
            <v-container fluid>
                <v-row align="center" justify="start" dense>
                    <v-col v-for="(item, i) in tenants" :key="i" cols="12" lg="6" md="12">
                        <v-row :id="`dormID${i + 1}`" dense>
                            <v-col cols="12" md="6">
                                <v-card height="100%" outlined light>
                                    <v-card-text class="text-center">
                                        <div class="font-weight-bold text-h6 mt-n3">DREAM DORMITORY PASS</div>
                                        <div class="caption">General Trias, Cavite</div>
                                    </v-card-text>
                                    <v-list-item>
                                        <v-list-item-content class="mt-n6">
                                            <v-list-item-title class="font-weight-bold">{{ item.EmployeeName }}</v-list-item-title>
                                            <v-list-item-subtitle class="mt-2">{{ item.Company }}</v-list-item-subtitle>
                                            <v-list-item-subtitle class="mt-2">{{ item.Department }} Department</v-list-item-subtitle>
                                            <v-list-item-subtitle class="mt-2">{{ item.BuildingDesc }} - Room {{ item.RoomNo }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-action class="text-center mt-n2">
                                            <v-avatar color="grey darken-4" size="110" tile>
                                                <v-avatar size="108" tile>
                                                    <img :src="`${photo}/${item.EmployeeCode}.jpg`" />
                                                </v-avatar>
                                            </v-avatar>
                                            <v-list-item-action-text class="mr-3 font-weight-bold">{{ item.DormitoryPassCode }}</v-list-item-action-text>
                                        </v-list-item-action>
                                    </v-list-item>
                                    <v-sheet class="text-center white--text mb-1" color="grey darken-1" width="100%" tile>
                                        <div class="caption">Bed Space Rental Trial valid until {{moment(item.ValidDate).format('MMMM DD, YYYY')}}</div>
                                    </v-sheet>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-card height="100%" outlined light>
                                    <v-container class="fill-height">
                                        <v-row class="text-center mt-12" align="center" justify="center">
                                            <v-card-text>
                                                In case of loss, please surrender to HTI Administration
                                            </v-card-text>
                                            <v-card-text class="mt-n8">
                                                General Affairs section
                                            </v-card-text>
                                        </v-row>
                                        <v-row>
                                            <v-card-text class="text-center mt-5">
                                                <div class="font-weight-bold">{{ approver }}</div>
                                                <v-divider class="mx-12"></v-divider>
                                                Approving Authority
                                            </v-card-text>
                                        </v-row>
                                    </v-container>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-lazy>
</template>

<script>
export default {
    data() {
        return {
            tenants: [],
            approver: process.env.VUE_APP_APPROVER
        }
    },
    created() {
        this.tenants = this.$route.query
    },
    methods: {
        printDormID() {
            let data = []
            this.handleQuestionMessage('', 'Download Gate Pass?', 'Download', null, 'question').then(result => {
                if(result.isConfirmed) {
                    this.tenants.forEach((rec, index, array) => {
                        data.push({
                            code: rec.EmployeeCode,
                            element: `dormID${index + 1}`
                        })
                        if(index == array.length - 1) {
                            this.printDormitoryID(data)
                        }
                    })
                }
            })
        }
    }

}
</script>