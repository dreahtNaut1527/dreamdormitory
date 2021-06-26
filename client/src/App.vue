<template>
    <v-app id="inspire" :style="`background-color: ${darkMode ? '' : '#F5F5F5'};`">
        <navdrawer v-if="hrisUserInfo.USERACCT != undefined" />
        <router-view />
        <navfooter v-if="hrisUserInfo.USERACCT != undefined" />
    </v-app>
</template>

<script>
import navdrawer from '@/components/navdrawer'
import navfooter from '@/components/navfooter'

export default {
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