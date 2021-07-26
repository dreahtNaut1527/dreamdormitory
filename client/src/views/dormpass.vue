<template>
    <v-main>
        <v-breadcrumbs :items="breadCrumbsItems" divider="/"></v-breadcrumbs>
        <v-container fluid>
            <router-view></router-view>
        </v-container>
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
    watch: {
        $route(to) {
            switch(to.name) {
                case 'dormpassedit':
                    this.breadCrumbsItems = [ 
                        {text: 'Process', disabled: false, href: '#'},
                        {text: 'Dormitory Pass', disabled: false, href: '#'},
                        {text: 'Edit', disabled: true, href: '#'}
                    ]
                    break;
                case 'dormpassidpreview':
                    this.breadCrumbsItems = [ 
                        {text: 'Process', disabled: false, href: '#'},
                        {text: 'Dormitory Pass', disabled: false, href: '#'},
                        {text: 'Dormitory Gate Pass', disabled: true, href: '#'}
                    ]
                    break;
                case 'dormappliances':
                    this.breadCrumbsItems = [ 
                        {text: 'Process', disabled: false, href: '#'},
                        {text: 'Dormitory Pass', disabled: false, href: '#'},
                        {text: 'Dormitory Materials-Appliances', disabled: true, href: '#'}
                    ]
                    break;
                default:
                    this.breadCrumbsItems = [ 
                        {text: 'Process', disabled: false, href: '#'},
                        {text: 'Dormitory Pass', disabled: true, href: '#'}
                    ]
                    break;
            }
        }
    }
}
</script>