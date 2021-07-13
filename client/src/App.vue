<template>
    <v-app id="inspire" :style="`background-color: ${ darkMode ? '' : $route.path != '/' ? '' : themeColor == '' ? '#1976d2' : themeColor };`">
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