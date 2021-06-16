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
        </v-navigation-drawer>
        <v-app-bar color="transparent" dense flat>
            <v-spacer></v-spacer>
            <v-btn class="mx-2" icon><v-icon>mdi-bell</v-icon></v-btn>
            <v-btn class="mr-2" icon><v-icon>mdi-account</v-icon></v-btn>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    data() {
        return {
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
                        {text: 'Vacanies', icon: 'mdi-calendar-check', to: '/vacanies'},
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
        }
    }
}
</script>