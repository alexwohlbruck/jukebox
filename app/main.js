import Vue from 'vue'
import VueMaterial from 'vue-material'
import App from './src/App'
import router from './src/router'
import store from './src/store'
import 'vue-material/dist/vue-material.min.css'
import './src/css/style.scss'

Vue.use(VueMaterial)

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App
	}
})