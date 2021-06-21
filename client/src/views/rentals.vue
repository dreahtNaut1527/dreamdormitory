<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        v-
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            breadCrumbsItems: [ 
                {text: 'Process', disabled: false, href: '#'},
                {text: 'Rentals', disabled: true, href: '#'}
            ]
        }
    },
    created() {

    },
    methods: {
        
    }
}
</script>