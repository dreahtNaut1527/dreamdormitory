module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    host: '0.0.0.0',
    port: '3000', //name of port
    public: '0.0.0.0:3000',
    disableHostCheck: true,
    noInfo: true
  },
  publicPath: process.env.NODE_ENV ==='dreamdormitory' ? '/dreamdormitory/' : '/'
} 