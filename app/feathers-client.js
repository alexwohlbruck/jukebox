import feathers from 'feathers/client'
import hooks from 'feathers-hooks'
import socketio from 'feathers-socketio/client'
import auth from 'feathers-authentication-client'
import io from 'socket.io-client'

const socket = io('http://localhost:3030', {transports: ['websocket']})

const feathersClient = feathers()
	.configure(hooks())
	.configure(socketio(socket))
	.configure(auth({ storage: window.localStorage }))

export default feathersClient