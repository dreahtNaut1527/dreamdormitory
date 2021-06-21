<template>
    <v-main>
        <v-container class="fill-height">
            <v-row align="center" justify="center">
                <v-col cols="12" md="10">
                    <v-card elevation="12">
                        <v-row justify="center" no-gutters>
                            <v-col class="hidden-md-and-down" cols="12" md="7">
                                <v-img src="../assets/5433.jpg">
                                    <v-container style="position:absolute;bottom:0px">
                                        <v-list-item two-line>
                                            <v-list-item-content class="font-weight-bold">
                                                <v-list-item-title>House Technology Industries Pte., Ltd.</v-list-item-title>
                                                <v-list-item-subtitle>Dream Dormitory</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-container>
                                </v-img>
                            </v-col>
                            <v-col cols="12" md="5">
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
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            cocode: '',
            username: '',
            password: '',
            userInfo: {}
        }
    },
    created() {
        this.$store.commit('CHANGE_USER_INFO', {})
        this.$store.commit('CHANGE_LOGGING', false)
    },
    methods: {
        userLoggedIn() {
            this.readINIFile().then(res => this.cocode = res.data.HRIS.Code)
            this.axios.post(`${this.api_HRIS}/ora_getusercontrol.php`, {username: this.username}).then(res => {
                this.userInfo = res.data[0]
                Object.assign(this.userInfo, {
                    CODE: this.cocode
                })
                if(this.md5(this.password.toLowerCase()) == this.md5(this.userInfo.PASSWORD.toLowerCase())) {
                    this.$store.commit('CHANGE_USER_INFO', this.userInfo)
                    this.$store.commit('CHANGE_LOGGING', true)
                    this.$router.push('/dashboard')
                }
            })
        }
    }
}
</script>