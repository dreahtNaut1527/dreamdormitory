import { mapState, mapMutations } from 'vuex'
// import store from '../store'

const plugins = {
    install(Vue) {
        Vue.mixin({
            data: () => ({
                
            }),
            created() {

            },
            computed: {
                ...mapState([
                    'hrisUserInfo'
                ])
            },
            methods: {
                ...mapMutations([
                    'CHANGE_USER_INFO'
                ])
            }
        })
    }
}

export default plugins