import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import YrTextField from '@/components/atoms/YrTextField.vue'
import YrBtn from '@/components/atoms/YrBtn.vue'

import YrPasswordField from '@/components/molecules/YrPasswordField.vue'
import YrIconBtn from '@/components/molecules/YrIconBtn.vue'

import YrDialogCard from '@/components/templates/YrDialogCard.vue'

Vue.config.productionTip = false

Vue.component('yr-text-field', YrTextField)
Vue.component('yr-btn', YrBtn)

Vue.component('yr-password-field', YrPasswordField)
Vue.component('yr-icon-btn', YrIconBtn)

Vue.component('yr-dialog-card', YrDialogCard)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
