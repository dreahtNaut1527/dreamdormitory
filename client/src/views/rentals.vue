<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <setcutoff
            :setcutoffdialog="setcutoffdialog"
        >
        </setcutoff>
    </v-main>
</template>

<script> 
import setcutoff from "../components/setcutoff.vue";
export default {
   
    data() {
        return {
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Rentals', disabled: true, href: '#'}
            ],
            setcutoffdialog:false,
        }
    },
    created() {
        this.setcutoffdialog=!this.setcutoffdialog
    },
    methods: {
        
    },
    components:{
        setcutoff
    }
}
</script>