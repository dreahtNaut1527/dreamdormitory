<template>
    <v-app id="inspire" :style="`background-color: ${$route.path != '/' ? '#F5F5F5' : '#F5F5F5'};`">
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