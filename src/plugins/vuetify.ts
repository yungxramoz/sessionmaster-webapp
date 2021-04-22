import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#3d9797',
        secondary: '#e9c46a',
        accent: '#f9b7ab',
        info: '#8d99ae',
        warning: '#f2c14e',
        error: '#e76f51',
        success: '#5dd39e',
      },
    },
  },
})
