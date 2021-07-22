<template>
    <v-main>
        <v-container class="fill-height">
            <v-row align="center" justify="center">
                <v-col cols="12" lg="3" md="6" sm="5">
                    <v-card elevation="12">
                        <v-container>
                            <v-card-title>
                                <v-card-text class="text-center font-weight-bold text-h4 pt-8">
                                    <v-badge :color="themeColor == '' ? '#1976d2' : themeColor" :content="version">Dream Dormitory</v-badge>
                                </v-card-text>
                            </v-card-title>
                            <v-card-text>
                                <v-row align="center" justify="center">
                                    <v-col cols="12" md="12">
                                        <v-text-field
                                            v-model="username"
                                            :color="themeColor == '' ? '#1976d2' : themeColor"
                                            placeholder="Enter your username"
                                            append-icon="mdi-account"
                                            hide-details
                                            outlined
                                            rounded
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-text-field
                                            v-model="password"
                                            :color="themeColor == '' ? '#1976d2' : themeColor"
                                            @keypress.enter="userLoggedIn()"
                                            placeholder="Enter your password"
                                            type="password"
                                            append-icon="mdi-lock"
                                            hide-details
                                            outlined
                                            rounded
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn @click="userLoggedIn()" :color="themeColor == '' ? '#1976d2' : themeColor" block dark>Login</v-btn>
                            </v-card-actions>
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-snackbar v-model="alert" transition="scroll-x-reverse-transition" color="error" :timeout="3000" bottom right>
            {{ alertText }}
        </v-snackbar>
        <v-overlay :value="loading">
            <v-card color="white" width="100%">
                <v-row align="center" justify="center">
                    <v-col class="text-center" cols="12">
                        <v-avatar size="250">
                            <v-img src="../assets/rocket.gif" />
                        </v-avatar>
                    </v-col>
                    <v-col class="text-center" cols="12">
                        <v-card-text class="font-weight-bold grey--text text-h4">Welcome New User.</v-card-text>
                        <v-card-text class="mt-n4 grey--text">Please wait for a moment while setting up some changes.</v-card-text>
                    </v-col>
                </v-row>
            </v-card>
        </v-overlay>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            alert: false,
            loading: false,
            iniFile: '',
            username: '',
            password: '',
            alertText: '',
            version: process.env.VUE_APP_VERSION,
            userInfo: {}
        }
    },
    created() {
        // this.handleClearTable()
        this.$store.commit('CHANGE_USER_INFO', {})
        this.$store.commit('CHANGE_HRSYS', {})
        this.$store.commit('CHANGE_LOGGING', false)
    },
    mounted() {
        this.readINIFile().then(res => this.$store.commit('CHANGE_HRSYS', res.data))
    },
    methods: {
        userLoggedIn() {
            let hris = this.hrsys.HRIS
            let body = {
                cocode: hris.COCODE,
                abbr: hris.ABBR,
                username: this.username,
                project_code: process.env.VUE_APP_PROJECT_CODE
            }
            this.axios.post(`${this.api_HRIS}/ora_getusercontrol.php`, body).then(async res => {
                this.userInfo = res.data[0]
                if(this.userInfo != undefined) {
                    if(this.md5(this.password.toLowerCase()) == this.md5(this.userInfo.PASSWORD.toLowerCase())) {
                        Object.assign(this.userInfo, {
                            PROCCODE: this.userInfo.PROCCODE.split(","),
                            PROCDESC: this.userInfo.PROCDESC.split(",")
                        })

                        // Check if login user is HTI
                        if(hris.COCODE == '20') {
                            // Get all data from local database
                            let station = await this.handleSelectData()
                            // If local database is empty
                            if(station.length == 0) {
                                this.axios.post(`${this.api_HRIS}/ora_company.php`, {abbr: hris.ABBR}).then(res => {
                                    this.getAllStationData(res.data)
                                })
                            } else {
                                this.$store.commit('CHANGE_USER_INFO', this.userInfo)
                                this.$store.commit('CHANGE_LOGGING', true)
                                this.$router.push('/dashboard')
                            }
                        } else {
                        // Other company
                            this.stationSearch(hris.ABBR, null).then(async res => {
                                if(Array.isArray(res.data)) {
                                    this.handleInsertData(res.data)
                                    this.$store.commit('CHANGE_USER_INFO', this.userInfo)
                                    this.$store.commit('CHANGE_LOGGING', true)
                                    this.$router.push('/dashboard')
                                } else {
                                    this.alert = true
                                    this.alertText = 'Network error: Please contact your administrator'
                                }
                            })
                        }
                    } else {
                        this.alert = true
                        this.alertText = 'Username or Password do not match'
                    }
                } else {
                    this.alert = true
                    this.alertText = `${this.username}: No rights for Dream Dormitory`
                    this.username = ''
                    this.password = ''
                }
            })
        },
        getAllStationData(data) {
            this.loading = true
            let arrayVal = []
            new Promise(() => {
                data.forEach(rec => {
                    arrayVal.push(this.stationSearch(rec.SHORTNAME, null))
                })

                this.axios.all(arrayVal).then(this.axios.spread(async (...res) => {
                    res.forEach(rec => {
                        if(Array.isArray(rec.data)) {
                            this.handleInsertData(rec.data)
                        }
                    })
                    this.loading = false
                    this.$store.commit('CHANGE_USER_INFO', this.userInfo)
                    this.$store.commit('CHANGE_LOGGING', true)
                    this.$router.push('/dashboard')
                }))
            })
        }
    }
}
</script>