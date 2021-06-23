import { mapState, mapMutations } from 'vuex'
// import store from '../store'

const plugins = {
    install(Vue) {
        Vue.mixin({
            data: () => ({
                api: process.env.NODE_ENV ==='dreamdormitory' ? process.env.VUE_APP_URL : process.env.VUE_APP_LOCAL_URL,
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
                    'darkMode'
                ])
            },
            methods: {
                ...mapMutations([
                    'CHANGE_USER_INFO',
                    'CHANGE_CONNECTION',
                    'CHANGE_LOGGING',
                    'CHANGE_THEMECOLOR',
                    'CHANGE_DARKMODE'
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