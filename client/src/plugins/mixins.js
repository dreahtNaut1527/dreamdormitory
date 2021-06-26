import { mapState, mapMutations } from 'vuex'
import store from '../store'

const plugins = {
    install(Vue) {
        Vue.mixin({
            data: () => ({
                api: process.env.NODE_ENV ==='dreamdormitory' ? process.env.VUE_APP_URL : process.env.VUE_APP_LOCAL_URL,
                server: 'http://localhost:8800', // process.env.VUE_APP_SERVER,
                api_HRIS: 'http://localhost:8080/server/api',
                photo: process.env.VUE_APP_PHOTO
            }),
            created() {

            },
            computed: {
                ...mapState([
                    'hrisUserInfo',
                    'isConnect',
                    'isLoggedIn',
                    'themeColor',
                    'darkMode',
                    'appVersion'
                ])
            },
            methods: {
                ...mapMutations([
                    'CHANGE_USER_INFO',
                    'CHANGE_CONNECTION',
                    'CHANGE_LOGGING',
                    'CHANGE_THEMECOLOR',
                    'CHANGE_DARKMODE',
                    'CHANGE_APP_VERSION'
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
                rightString(str, chr) {
                    return str.slice(str.length - chr, str.length);
                },
                leftString(str, chr) {
                    return str.slice(0, chr - str.length);
                },
                getCompanyLogo(cocode) {
                    let path = null
                    switch (cocode) {
                        case '00':
                            path = require('../assets/PVlogo.png')
                            break;
                        case '10':
                            path = require('../assets/SCADlogo.png')
                            break;
                        case '20':
                            path = require('../assets/HTIlogo.png')
                            break;
                        case '40':
                            path = require('../assets/WKNlogo.png')
                            break;
                        default:
                            path = require('../assets/HRDlogo.png')
                            break;
                    }
                    return path
                },
                getMonth() {
                    let data = []
                    for (let i = 1; i < 13; i++) {
                        data.push({
                            text: this.moment(this.zeroPad(i, 2), 'MM').format('MMMM'),
                            value: this.zeroPad(i, 2)
                        })
                    }
                    return data
                },
                setNotifications(code, message) {
                     let body = {
                          procedureName: 'ProcPushNotification',
                          values: [
                               0,
                               this.$socket.id,
                               this.hrisUserInfo.CODE,
                               code,
                               message,
                               1
                          ]
                     }
                     this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                     this.$socket.emit('newNotifications', body.values)
                },
                checkAppVersion() {
                     let version = null
                     this.axios.get(`${this.server}/appversion`).then(res => {
                          version = res.data
                          if(version != this.appVersion) {
                               store.commit('CHANGE_APP_VERSION', version)
                               store.commit('CHANGE_CONNECTION', true)
                               store.commit('CHANGE_USER_INFO', {})
                               store.commit('CHANGE_LOGGING', false)
                               store.commit('CHANGE_THEMECOLOR', '#1976d2')
                               store.commit('CHANGE_DARKMODE', false)
                               if(this.$route.name != 'login') {
                                    this.$router.push('/')
                               }
                          }
                     })
                },

                // Load Masters Maintenance
                loadMasterMaintenance(tablename) {
                    let body = {
                        procedureName: 'ProcSelectQuery',
                        values: [tablename]
                    }
                    return this.axios.post(`${this.api}/executeselect`, {data: JSON.stringify(body)})
                },

                // HRIS station search
                stationSearch(code) {
                    return this.axios.post(`${this.api_HRIS}/ora_stationsearch.php`, {emplcode: code})
                }

            }
        })
    }
}

export default plugins