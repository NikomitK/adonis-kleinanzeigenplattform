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

import ListingsController from '#controllers/listings_controller'
import UsersController from '#controllers/users_controller'


router.get('/', [ListingsController, 'home'])

router.get('/register', [UsersController, 'registerForm'])

router.post('/register', [UsersController, 'registerProcess'])

router.get('/login', [UsersController, 'loginForm'])

router.post('/login', [UsersController, 'loginProcess'])

router.get('/logout', [UsersController, 'logout'])

router.get('/kaffee', [UsersController, 'coffee'])

router.get('/konto', [UsersController, 'konto'])

router.post('/konto', [UsersController, 'updateProfile'])

router.get('/meine-anzeigen', [ListingsController, 'myListings'])

router.get('/anzeige-aufgeben', [ListingsController, 'createForm'])

router.post('/anzeige-aufgeben', [ListingsController, 'createProcess'])

router.get('/anzeige/:id', [ListingsController, 'show']) 

router.get('/anzeige/:id/bearbeiten', [ListingsController, 'editForm'])

router.post('/anzeige/:id/bearbeiten', [ListingsController, 'editProcess'])

router.get('/anzeige/:id/deaktivieren', [ListingsController, 'changeState'])

router.get('/anzeige/:id/verkauft', [ListingsController, 'changeState'])

router.put('anzeige/:id/save', [UsersController, 'saveListing'])

router.put('anzeige/:id/unsave', [UsersController, 'unsaveListing'])

router.get('/gespeichert', [ListingsController, 'savedListings'])

router.get('/chat-overview', [UsersController, 'displayChatOverview'])

router.get('/chat/:id/:username', [UsersController, 'displayChat'])

router.post('/chat/:id/:username', [UsersController, 'processChatMessage'])