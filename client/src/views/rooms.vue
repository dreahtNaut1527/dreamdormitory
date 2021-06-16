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
                {text: 'Rooms', disabled: true, href: '#'}
            ]
        }
    },
    created() {

    },
    methods: {
        
    }
}
</script>