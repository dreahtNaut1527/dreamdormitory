<template>
    <div>
        <v-navigation-drawer 
            :mini-variant="true"
            :color="themeColor == '' ? '#1976d2' : themeColor"
            permanent
            dark
            app
        >
            <v-list-item class="px-2">
                <v-list-item-avatar>
                    <v-img src="../assets/dormitory.png"></v-img>
                </v-list-item-avatar>
            </v-list-item>
            <v-list>
                <v-list-item v-for="(item, i) in navDrawerLists" :key="i">  
                    <v-list-item-action class="ml-n3">
                        <v-menu content-class="elevation-0" transition="slide-x-transition" v-model="item.active" :nudge-right="10" :nudge-width="150" offset-x tile>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="item.active" v-on="on" v-bind="attrs" large icon>
                                    <v-tooltip right>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon v-on="on" v-bind="attrs" >{{ item.icon }}</v-icon>
                                        </template>
                                        <span>{{ item.title }}</span>
                                    </v-tooltip>
                                </v-btn>
                            </template>
                            <v-card outlined flat>
                                <v-subheader class="font-weight-bold">{{ item.title }}</v-subheader>
                                <v-divider></v-divider>
                                <v-list dense>
                                    <v-list-item v-for="(childItem, i) in item.items" :key="i" :to="childItem.to" link>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>{{childItem.text}}</v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>{{childItem.icon}}</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-menu>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
            <template v-slot:append>
                <v-container>
                    <v-btn @click="sideDrawer = !sideDrawer" icon><v-icon>mdi-cog</v-icon></v-btn>
                </v-container>
            </template>
        </v-navigation-drawer>
        <v-app-bar color="transparent" dense flat>
            <v-spacer></v-spacer>
            <v-btn class="mx-2" icon><v-icon>mdi-bell</v-icon></v-btn>
            <v-menu
                v-model="menu"
                transition="fade-transition"
                :nudge-width="200"
                :nudge-left="150"
                offset-y
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mr-2" v-on="on" v-bind="attrs" icon><v-icon>mdi-account</v-icon></v-btn>
                </template>
                <v-card>
                    <v-subheader class="overline">User</v-subheader>
                    <v-divider></v-divider>
                    <v-list dense>
                        <v-list-item two-list>
                            <v-list-item-avatar>
                                <v-img :src="`${photo}/${ hrisUserInfo.USERACCT.length > 5 ? hrisUserInfo.USERACCT.substring(1, 6) : hrisUserInfo.USERACCT}.jpg`" />
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold">{{ hrisUserInfo.USERACCT }}</v-list-item-title>
                                <v-list-item-subtitle class="caption">{{ hrisUserInfo.FULLNAME }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn @click="overlay = !overlay" v-on="on" v-bind="attrs" icon><v-icon>mdi-logout</v-icon></v-btn>
                                    </template>
                                    <span>Log-out</span>
                                </v-tooltip>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </v-app-bar>

        <!-- Left navigation drawer -->
        <v-navigation-drawer
            v-model="sideDrawer"
            :disable-resize-watcher="true"
            hide-overlay
            temporary
            right
            app   
        >
            <v-toolbar color="transparent" flat>
                <v-toolbar-title>Settings</v-toolbar-title>
            </v-toolbar>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-subtitle>Theme Color</v-list-item-subtitle>
                    <v-color-picker 
                        v-model="themeColorVal"
                        mode="hexa" 
                        hide-mode-switch 
                        hide-canvas
                        :show-swatches="swatches"
                        :update:color="changeThemeColor(themeColorVal)"
                    ></v-color-picker>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                <v-btn x-small block text @click="swatches = !swatches" :color="themeColor == '' ? 'primary' : themeColor">
                    {{swatches == false ? "Show more" : "Hide"}}
                </v-btn>
                </v-list-item-content>
            </v-list-item>
            <v-divider class="mx-3"></v-divider>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-subtitle>Dark Mode</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <v-switch
                        v-model="dark"        
                        @change="changeTheme()"
                        inset
                    ></v-switch>
                </v-list-item-action>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-subtitle>Update Station</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <v-btn @click="handleUpdateStation()" :color="themeColor == '' ? '#1976d2' : themeColor" small dark fab>
                        <v-icon>mdi-upload</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-subtitle>Set Cut-Off</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <v-btn :color="themeColor == '' ? '#1976d2' : themeColor" block small dark fab>
                        <v-icon>mdi-calendar-range</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-navigation-drawer>
        <!-- End of Left navigation drawer -->

        <v-overlay v-model="overlay" absolute>
            <v-snackbar v-model="overlay" top app>
                <v-card-title class="pa-0 caption">Do you want to logout?</v-card-title>
                <template v-slot:action="{ attrs }">
                    <v-btn class="mx-3" @click="overlay = !overlay" v-bind="attrs" :color="themeColor == '' ? '#1976d2' : themeColor" small dark>No</v-btn>
                    <v-btn @click="userLoggedOut()" small text>Yes</v-btn>
                </template>
            </v-snackbar>
        </v-overlay>
    </div>
</template>

<script>


export default {
    data() {
        return {
            dark: false,
            menu: false,
            overlay: false,
            swatches: true,
            navDrawer: false,
            sideDrawer: false,
            themeColorVal: '',
            navDrawerLists: []
        }
    },
    created() {
        this.dark = this.darkMode
        this.themeColorVal = this.themeColor
        this.loadNavDrawerLists()
    },
    methods: {
        changeTheme() {
            this.$vuetify.theme.dark = this.dark
            this.icon = this.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'
            this.$store.commit('CHANGE_DARKMODE', this.dark)
        },
        changeThemeColor(val) {
            this.$store.commit('CHANGE_THEMECOLOR', val)
        },
        loadNavDrawerLists() {
            this.navDrawerLists = [
                {
                    title: 'Dashboard',
                    icon: 'mdi-view-dashboard',
                    items: [
                        {text: 'Overview', icon: 'mdi-poll', to: '/dashboard'}
                    ],
                    active: false   
                },
                {
                    title: 'Process',
                    icon: 'mdi-pencil-box',
                    items: [
                        {text: 'Vacanies', icon: 'mdi-calendar-check', to: '/vacancies'},
                        {text: 'Tenants', icon: 'mdi-account-tie', to: '/tenants'},
                        {text: 'Rentals' , icon: 'mdi-key-chain-variant', to: '/rentals'},
                        {text: 'Consumptions', icon: 'mdi-water', to: '/consumptions'},
                        {text: 'Dorm Pass', icon: 'mdi-card-account-details', to: '/dormpass'},
                        {text: 'History', icon: 'mdi-history', to: '/history'}
                    ],
                    active: false   
                },
                {
                    title: 'Reports',
                    icon: 'mdi-file',
                    items: [
                        {text: 'Print Reports', icon: 'mdi-file', to: '/reports'}
                    ],
                    active: false   
                },
                {
                    title: 'Maintenance',
                    icon: 'mdi-cogs',
                    items: [
                        {text: 'Building', icon: 'mdi-domain', to: '/buildings'},
                        {text: 'Floors', icon: 'mdi-stairs', to: '/floors'},
                        {text: 'Rooms', icon: 'mdi-map-marker', to: '/rooms'},
                        {text: 'Beds' , icon: 'mdi-bed-empty', to: '/beds'},
                    ],
                    active: false   
                },
            ]
        },
        userLoggedOut() {
            this.handleClearTable(this.hrisUserInfo.ABBR)
            this.$store.commit('CHANGE_USER_INFO', {})
            this.$store.commit('CHANGE_LOGGING', false)
            this.$router.push('/')
        },
        handleUpdateStation() {
            this.handleQuestionMessage('', 'Update your local storage?', 'Update', 'question').then(result => {
                if(result.isConfirmed) {
                    this.updateStation()
                    this.handleToastMesaage().fire({
                        icon: 'success',
                        title: 'Update Success'
                    })
                }
            })
        }
    }
}
</script>