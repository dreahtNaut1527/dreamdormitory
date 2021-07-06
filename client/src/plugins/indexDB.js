const plugins = {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    indexedDB: null
                }
            },
            created() {
                
            },
            methods: {
                async connectDatabase(company) {
                    return new Promise((resolve, reject) => {
                        let request = window.indexedDB.open('hris', 1)
                        
                        request.onerror = e => {
                            console.log('Error connection to database', e)
                            reject('error')
                        }
    
                        request.onsuccess = e => {
                            this.indexedDB = e.target.result
                            resolve(this.indexedDB)
                            
                        }
    
                        request.onupgradeneeded = e => {
                            let db = e.target.result
                            db.createObjectStore(company, {autoIncrement: false, keyPath: 'EMPLCODE'})
                        }
                    })
                },

                async disconnectDatabase() {
                    return new Promise((resolve, reject) => {
                        let request = window.indexedDB.deleteDatabase('hris')
                        
                        request.onerror = e => {
                            console.log('Error connection to database', e)
                            reject('error')
                        }

                        request.onsuccess = () => {
                            resolve('true')
                        }
                    })
                },

                async handleSelectData(company) {
                    let results = []
                    let db = await this.connectDatabase(company)
                    
                    return new Promise(resolve => {
                        let dbTrans = db.transaction([company], 'readonly')
                        dbTrans.oncomplete = () => {
                            resolve(results)
                        }

                        let store = dbTrans.objectStore(company)
                        store.openCursor().onsuccess = e => {
                            let cursor = e.target.result
                            if(cursor) {
                                results.push(cursor.value)
                                cursor.continue()
                            }
                        }
                    })
                },

                async handleInsertData(company, val) {
                    await this.handleClearTable(company)
                    let db = await this.connectDatabase(company)

                    let dbTrans = db.transaction([company], 'readwrite')
                    let store = dbTrans.objectStore(company)
                    val.forEach(rec => {
                        store.put(rec)
                    })
                },

                async handleClearTable(company) {
                    let db = await this.connectDatabase(company)

                    let dbTrans = db.transaction([company], 'readwrite')
                    let store = dbTrans.objectStore(company)
                    store.clear()
                }
            }
        })
    }
}

export default plugins