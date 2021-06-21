<template>
    <div>
        <v-navigation-drawer 
            :mini-variant="true"
            color="primary"
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
                        <v-menu content-class="elevation-0" transition="slide-x-transition" v-model="item.active" :nudge-right="15" :nudge-width="150" offset-x tile>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="item.active" v-on="on" v-bind="attrs" large icon>
                                    <v-icon>{{item.icon}}</v-icon>
                                </v-btn>
                            </template>
                            <v-card outlined flat>
                                <v-subheader class="font-weight-bold">{{item.title}}</v-subheader>
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
                    <v-btn icon><v-icon>mdi-cog</v-icon></v-btn>
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
                                <v-img :src="`${photo}/${ hrisUserInfo.USERACCT.length <= 6 ? hrisUserInfo.USERACCT.substring(1, 6) : hrisUserInfo.USERACCT}.jpg`" />
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
        <v-overlay v-model="overlay">
            <v-snackbar v-model="overlay" top app>
                <v-card-title class="pa-0 caption">Do you want to logout?</v-card-title>
                <template v-slot:action="{ attrs }">
                    <v-btn class="mx-3" @click="overlay = !overlay" v-bind="attrs" color="primary" small dark>No</v-btn>
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
            menu: false,
            overlay: false,
            navDrawer: false,
            navDrawerLists: []
        }
    },
    created() {
        this.loadNavDrawerLists()
    },
    methods: {
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
                        {text: 'Consumptions', icon: 'mdi-water', to: '/consumptions'},
                        {text: 'Rentals' , icon: 'mdi-key-chain-variant', to: '/rentals'},
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
            this.$store.commit('CHANGE_USER_INFO', {})
            this.$store.commit('CHANGE_LOGGING', false)
            this.$router.push('/')
        }
    }
}
</script>