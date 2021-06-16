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
                {text: 'Maintenance', disabled: false, href: '#'},
                {text: 'Floors', disabled: true, href: '#'}
            ]
        }
    },
    created() {

    },
    methods: {
        
    }
}
</script>