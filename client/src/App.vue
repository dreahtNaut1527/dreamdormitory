<template>
    <v-app id="inspire" :style="`background-color: ${ darkMode ? '' : $route.path != '/' ? '' : themeColor == '' ? '#1976d2' : themeColor };`">
        <v-banner :value="!isConnect" single-line app>
            <v-card-text class="text-center pa-0">
                <v-icon color="warning" left>mdi-wifi-strength-alert-outline</v-icon>Network connection lost.
            </v-card-text>
        </v-banner>
        <navdrawer v-if="hrisUserInfo.USERACCT != undefined" />
        <router-view />
        <navfooter v-if="hrisUserInfo.USERACCT != undefined" />
    </v-app>
</template>

<script>
import navdrawer from '@/components/navdrawer'
import navfooter from '@/components/navfooter'

export default {
    created() {
        
    },
    mounted() {
        setInterval(() => {
            this.checkAppVersion()
        }, 1000);
    },
    components: {
        navdrawer,
        navfooter
    }
}
</script>