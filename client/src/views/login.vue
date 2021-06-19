<template>
    <v-main>
        <v-container class="fill-height">
            <v-row align="center" justify="center">
                <v-col cols="12" md="5" sm="8">
                    <v-card>
                        <v-toolbar flat>
                            <v-subheader class="text-center">LOGIN</v-subheader>
                        </v-toolbar>
                        <v-container class="pa-9">
                            <v-row align="center" justify="center">
                                <v-col cols="12" md="12">
                                    <v-text-field
                                        v-model="username"
                                        label="Username"
                                        append-icon="mdi-account"
                                        hide-details
                                        outlined
                                        rounded
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-text-field
                                        v-model="password"
                                        label="Password"
                                        append-icon="mdi-lock"
                                        hide-details
                                        outlined
                                        rounded
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-card-actions>
                            <v-btn @click="userLoggedIn()" color="primary" block dark>Login</v-btn>
                        </v-card-actions>
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
            let url = 'http://localhost:8080/server/api/ora_getusercontrol.php'
            this.axios.post(url, {username: this.username}).then(res => {
                console.log(res.data);
                this.userInfo = res.data[0]
                Object.assign(this.userInfo, {
                    CODE: this.cocode
                })
                if(this.password == this.userInfo.PASSWORD) {
                    this.$store.commit('CHANGE_USER_INFO', this.userInfo)
                    this.$store.commit('CHANGE_LOGGING', true)
                    this.$router.push('/dashboard')
                }
            })
        }
    }
}
</script>