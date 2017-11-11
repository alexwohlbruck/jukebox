import Vue from 'vue'
import VueMaterial from 'vue-material'
import App from './src/App'
import router from './src/router'
import store from './src/store'
import 'vue-material/dist/vue-material.css'

Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
	primary: 'cyan',
	accent: 'cyan',
	warn: 'red',
	background: 'white'
})

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App
	}
})