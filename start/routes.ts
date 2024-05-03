/*
|--------------------------------------------------------------------------
| Routes file 
|sass --watch "web engineering 2\Kleinanzeigen-proto\scss":Kleinanzeigenplattform\resources\css
|sass --watch --style=compressed webengineering2\Kleinanzeigen-proto\scss:adonis-kleinanzeigenplattform/resources/css
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import HomeController from '#controllers/home_controller'
import ListingsController from '#controllers/listings_controller'
import UsersController from '#controllers/users_controller'
import ChatsController from '#controllers/chats_controller'
import { middleware } from './kernel.js'



router.get('/', [HomeController, 'home'])

router.get('/gespeichert', [HomeController, 'savedListings']).use(middleware.auth())

router.get('/meine-anzeigen', [HomeController, 'myListings']).use(middleware.auth())

router.get('/register', [UsersController, 'registerForm']).use(middleware.guest())

router.post('/register', [UsersController, 'registerProcess']).use(middleware.guest())

router.get('/login', [UsersController, 'loginForm']).use(middleware.guest())

router.post('/login', [UsersController, 'loginProcess']).use(middleware.guest())

router.get('/logout', [UsersController, 'logout']).use(middleware.auth())

router.get('/kaffee', [UsersController, 'coffee'])

router.get('/konto', [UsersController, 'konto']).use(middleware.auth())

router.post('/konto', [UsersController, 'updateProfile']).use(middleware.auth())

router.put('anzeige/:id/save', [UsersController, 'saveListing']).use(middleware.auth())

router.put('anzeige/:id/unsave', [UsersController, 'unsaveListing']).use(middleware.auth())

router.get('/anzeige-aufgeben', [ListingsController, 'createForm']).use(middleware.auth())

router.post('/anzeige-aufgeben', [ListingsController, 'createProcess']).use(middleware.auth())

router.get('/anzeige/:id', [ListingsController, 'show'])

router.get('/anzeige/:id/bearbeiten', [ListingsController, 'editForm']).use(middleware.auth())

router.post('/anzeige/:id/bearbeiten', [ListingsController, 'editProcess']).use(middleware.auth())

router.get('/anzeige/:id/deaktivieren', [ListingsController, 'changeState']).use(middleware.auth())

router.get('/anzeige/:id/verkauft', [ListingsController, 'changeState']).use(middleware.auth())

router.get('/chat-overview', [ChatsController, 'displayChatOverview']).use(middleware.auth())

router.get('/chat/:id/:username', [ChatsController, 'displayChat']).use(middleware.auth())

router.post('/chat/:id/:username', [ChatsController, 'processChatMessage']).use(middleware.auth())