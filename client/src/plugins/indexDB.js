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
                async connectDatabase() {
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
                            db.createObjectStore('station', {autoIncrement: false, keyPath: 'EMPLCODE'})
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

                async handleSelectData() {
                    let results = []
                    let db = await this.connectDatabase()
                    // return new Promise(resolve => {
                    //     let dbTrans = db.transaction(['station'], 'readonly')
                    //     let store = dbTrans.objectStore('station').getAll()
                    //     store.onsuccess = e => {
                    //         console.log(e);
                    //         results = e.target.result
                    //         resolve(results)
                    //     }
                    // })
                    
                    return new Promise(resolve => {
                        let dbTrans = db.transaction(['station'], 'readonly')
                        dbTrans.oncomplete = () => {
                            resolve(results)
                        }

                        let store = dbTrans.objectStore('station')
                        store.openCursor().onsuccess = e => {
                            let cursor = e.target.result
                            if(cursor) {
                                results.push(cursor.value)
                                cursor.continue()
                            }
                        }
                    })
                },

                async handleInsertData(val) {
                    await this.handleClearTable()
                    let db = await this.connectDatabase()
                    let dbTrans = db.transaction(['station'], 'readwrite')
                    let store = dbTrans.objectStore('station')
                    val.forEach(rec => {
                        store.put(rec)
                    })
                },

                async handleClearTable() {
                    let db = await this.connectDatabase()
                    let dbTrans = db.transaction(['station'], 'readwrite')
                    let store = dbTrans.objectStore('station')
                    store.clear()
                }
            }
        })
    }
}

export default plugins