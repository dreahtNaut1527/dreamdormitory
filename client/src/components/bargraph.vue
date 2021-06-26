<script>
import { Line } from 'vue-chartjs'

export default {
     extends: Line,
    //  props: ['imageChartBase64', 'chartRecord'],
     data () {
          return {
               chartData: {},
               options: {
                    tooltips: {
                        mode: 'point'
                    },
                    scales: {
                         yAxes: [{
                              ticks: {
                                   // fontColor: '#f5f5f5',
                                   beginAtZero: true
                              },
                              gridLines: {
                                   display: true
                              }
                         }],
                         xAxes: [{
                              ticks: {
                                   // fontColor: '#f5f5f5',
                              },
                              gridLines: {
                                   display: false
                              }
                         }]
                    },
                    legend: {
                         display: true,
                         align: 'end',
                         position: 'bottom',
                         labels: {
                              // fontColor: '#f5f5f5',
                              fontSize: 16
                         }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    // animation: {
                    //      onComplete: function(animation) {
                    //           this.getImageBase(animation.chartInstance.toBase64Image())
                    //      }.bind(this)
                    // }
               },
               summaryRecords: [],
               summaryLabel: [],
               summaryData: []
          }
     },
     created() {
          this.loadSummaryOfActiveTenants()
     },
     methods: {
          loadSummaryOfActiveTenants() {
               let body = {
                    procedureName: 'ProcSummaryOfActiveTenants',
                    values: [this.hrisUserInfo.CODE]
               }
               this.axios.post(`${this.api}/executeselect`, {data: JSON.stringify(body)}).then(res => {
                    this.summaryRecords = res.data
                    this.summaryLabel = Object.keys(this.summaryRecords[0])
                    this.chartData = {
                         labels: this.summaryLabel,
                         datasets: [
                              {
                                label: 'Total Tenants',
                                data: Object.values(this.summaryRecords[0]),
                                fill: false,
                                borderColor: '#9ad0f5',
                              //   backgroundColor: 'rgb(255, 255, 255, 0.5)',
                                borderWidth: 2
                              }
                         ]
                    }
                    // Convert chart to image base 64 for report
                    this.renderChart(this.chartData, this.options)
               })
          },
        //   getImageBase(val) {
        //        this.$emit('update:imageChartBase64', val)
        //        this.$emit('update:chartRecord', this.summaryRecords)
        //   }
     }
  }
</script>