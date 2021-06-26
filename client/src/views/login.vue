<template>
    <v-main>
        <v-container class="fill-height">
            <v-row align="center" justify="center">
                <v-col cols="12" lg="9" md="10" sm="10">
                    <v-card elevation="12">
                        <v-row justify="center" no-gutters>
                            <v-col class="hidden-md-and-down" cols="12" lg="7" md="7">
                                <v-img src="../assets/5433.jpg">                                    
                                    <v-container style="position:absolute;bottom:0px">
                                        <v-list-item two-line>
                                            <v-list-item-content>
                                                <v-list-item-title class="title font-weight-bold">Dream Dormitory</v-list-item-title>
                                                <v-list-item-subtitle class="font-weight-bold">House Technology Industries Pte., Ltd.</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-container>
                                </v-img>
                            </v-col>
                            <v-col cols="12" lg="5" md="5">
                                <v-row align="center" justify="center">
                                    <v-col cols="12" md="12">
                                        <v-container>
                                            <v-subheader class="font-weight-bold">Dream Dormitory</v-subheader>
                                        </v-container>
                                    </v-col>
                                </v-row>
                                <v-container :class="$vuetify.breakpoint.smAndDown ? '' : 'fill-height'">
                                    <v-row align="center" justify="center">
                                        <v-col cols="12" md="12">
                                            <v-card-text class="text-center font-weight-bold subtitle-1">Log-in to your account</v-card-text>
                                        </v-col>
                                        <v-col cols="12" md="12">
                                            <v-text-field
                                                v-model="username"
                                                placeholder="Enter your username"
                                                append-icon="mdi-account"
                                                hide-details
                                                outlined
                                                rounded
                                                dense
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="12">
                                            <v-text-field
                                                v-model="password"
                                                @keypress.enter="userLoggedIn()"
                                                placeholder="Enter your password"
                                                type="password"
                                                append-icon="mdi-lock"
                                                hide-details
                                                outlined
                                                rounded
                                                dense
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="12">
                                            <v-card-actions>
                                                <v-btn @click="userLoggedIn()" color="primary" block dark>Login</v-btn>
                                            </v-card-actions>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-snackbar v-model="alert" transition="scroll-x-reverse-transition" color="error" :timeout="3000" bottom right>
            {{ alertText }}
        </v-snackbar>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            alert: false,
            cocode: '',
            username: '',
            password: '',
            alertText: '',
            userInfo: {}
        }
    },
    created() {
        this.$store.commit('CHANGE_USER_INFO', {})
        this.$store.commit('CHANGE_LOGGING', false)
    },
    methods: {
        userLoggedIn() {
            // this.readINIFile().then(res => this.cocode = res.data.HRIS.Code)
            this.axios.post(`${this.api_HRIS}/ora_getusercontrol.php`, {username: this.username}).then(res => {
                this.userInfo = res.data[0]

                if(this.userInfo) {
                    if(this.md5(this.password.toLowerCase()) == this.md5(this.userInfo.PASSWORD.toLowerCase())) {
                        this.$store.commit('CHANGE_USER_INFO', this.userInfo)
                        this.$store.commit('CHANGE_LOGGING', true)
                        this.$router.push('/dashboard')
                    } else {
                        this.alert = true
                        this.alertText = 'Username or Password do not match'
                    }
                } else {
                    this.alert = true
                    this.alertText = 'Account does not exists'
                    this.username = ''
                    this.password = ''
                }
            })
        }
    }
}
</script>