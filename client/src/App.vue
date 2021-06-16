<template>
    <v-app id="inspire">
        <navdrawer v-if="hrisUserInfo.USERACCT != undefined" />
        <router-view />
    </v-app>
</template>

<script>
import navdrawer from '@/components/navdrawer'

export default {
    components: {
        navdrawer
    }
}
</script>