<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Dormitory Pass', disabled: true, href: '#'}
            ]
        }
    },
    created() {

    },
    methods: {
        
    }
}
</script>