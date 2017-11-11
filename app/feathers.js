import Feathers from 'feathers/client'
import hooks from 'feathers-hooks'
import authentication from 'feathers-authentication/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'

const socket = io(process.env.FEATHERS_HOST || 'http://localhost:3030')
const feathers = Feathers()
	.configure(socketio(socket))
	.configure(hooks())
	.configure(authentication({storage: window.localStorage}))

import Vue from 'vue'
import VueFeathers from 'vue-feathers'
Vue.use(VueFeathers, feathers)

export default feathers