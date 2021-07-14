<template>
     <v-menu
          ref="menu"
          v-model="menuDialog"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="290px"
     >
          <template v-slot:activator="{ on, attrs }">
               <v-text-field
                    v-model="date"
                    :label="label"
                    :color="themeColor == '' ? '#1976d2' : themeColor"
                    @click:append="menuDialog = true"
                    append-icon="mdi-calendar"
                    v-bind="attrs"
                    v-on="on"
                    hide-details
                    clearable
                    outlined
                    readonly
                    dense
               ></v-text-field>
          </template>
          <v-date-picker
               v-model="date"
               no-title
               scrollable
               :events="events"
               event-color="#ED6351"
               :color="themeColor == '' ? '#1976d2' : themeColor"
               @change="$refs.menu.save(date)"
          >
          </v-date-picker>
     </v-menu>
</template>

<script>
export default {
     props: [
          'menu',
          'dateValue',
          'dateLabel'
     ],
     data() {
          return {
               events: [],
               menuDialog: false,
               date: this.dateValue,
               label: this.dateLabel
          }
     },
     created() { 
          this.loadEvents()
     },
     methods: {
          loadEvents() {
               this.axios.get(`${this.api_HRIS}/ora_timeholidays.php`, {abbr: this.hrisUserInfo.ABBR}).then(res => {
                    res.data.forEach(rec => {
                         this.events.push(this.moment(rec.HOLDATE).format('YYYY-MM-DD'))
                    })
               })
          }
     },
     watch: {
          menu() {
               this.menuDialog = true
          },
          dateValue(val) {
               this.date = val
          },
          date(val) {
               this.$emit('update:dateValue', val)
               this.menuDialog = false
          }
     }
}
</script>