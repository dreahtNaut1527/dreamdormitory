import { mapState, mapMutations } from 'vuex'
// import store from '../store'

const plugins = {
    install(Vue) {
        Vue.mixin({
            data: () => ({
                api: process.env.NODE_ENV ==='dreamdormitory' ? process.env.VUE_APP_URL : process.env.VUE_APP_LOCAL_URL
            }),
            created() {

            },
            computed: {
                ...mapState([
                    'hrisUserInfo',
                    'isConnect',
                    'isLoggedIn'
                ])
            },
            methods: {
                ...mapMutations([
                    'CHANGE_USER_INFO',
                    'CHANGE_CONNECTION',
                    'CHANGE_LOGGING'
                ]),
                zeroPad(num, numZeros) {
                    let n = Math.abs(num)
                    let zeros = Math.max(0, numZeros - Math.floor(n).toString().length )
                    let zeroString = Math.pow(10,zeros).toString().substr(1)
                    
                    if( num < 0 ) {
                        zeroString = '-' + zeroString
                    }
                
                    return zeroString + n
                },
                readINIFile() {
                    return this.axios.get(`${this.api}/config`)
                },

                // Load Masters Maintenance
                loadMasterMaintenance(tablename) {
                    let body = {
                        procedureName: 'ProcSelectQuery',
                        values: [tablename]
                    }
                    return this.axios.post(`${this.api}/executeselect`, {data: JSON.stringify(body)})
                }

            }
        })
    }
}

export default plugins