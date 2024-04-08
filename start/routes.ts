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

/*const products = [
    {
        id: 1,
        name: 'Fast neues Auto',
        price: 100,
        image: 'resources/images/auto.webp',
        description: 'Hat ein paar kleine Kratzer und Dellen, aber das ist der Charakterdes Autos.'
    },
    {
        id: 2,
        name: 'Apple google',
        price: 100,
        image: 'resources/images/apple-google.jpg',
        description: 'Apple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple google'
    },
    {
        id: 3,
        name: 'Alles',
        price: 100,
        image: 'resources/images/alles.jpg',
        description: 'Ich verkaufe alles was existiert.'
    },
    {
        id: 4,
        name: 'Svenjamin',
        price: 100,
        negotiable: true,
        shipping: true,
        shippingPrice: 10,
        image: 'resources/images/sven.jpg',
        description: 'Some quick example text to build on the card title and make up the bulk of the cards content.'
    },
    {
        id: 5,
        name: 'Apple google',
        price: 100,
        image: 'resources/images/apple-google.jpg',
        description: 'Apple google'
    },
    {
        id: 6,
        name: 'Alles',
        price: 100,
        image: 'resources/images/alles.jpg',
        description: 'Ich verkaufe alles was existiert.'
    },
    {
        id: 7,
        name: 'Svenjamin',
        price: 100,
        image: 'resources/images/sven.jpg',
        description: 'Some quick example text to build on the card title and make up the bulk of the cards content.'
    },
    {
        id: 8,
        name: 'Gniesbert',
        price: 999999,
        image: 'resources/images/gniesbert.png',
        description: 'Mein scheiss Hund Gniesbert ist schon wieder in meinen Gaming pc geklettert, weshalb ich ihn verkaufen muss. Er ist 3 Jahre alt und hat schon 2 mal meinen Gaming pc zerstört. Ich verkaufe ihn für 999999€. Versand ist möglich, er läuft dann zu dir.'
    }
]*/

router.get('/', [ListingsController, 'home'])

router.get('/register', [UsersController, 'registerForm'])

router.post('/register', [UsersController, 'registerProcess'])

router.get('/login', [UsersController, 'loginForm'])

router.post('/login', [UsersController, 'loginProcess'])

router.get('/logout', [UsersController, 'logout'])

router.get('/gespeichert', [ListingsController, 'savedListings'])

/*router.get('/konto', async ({ view }) => {
    const konto = {
        image: 'resources/images/sven.jpg',
        nutzername: 'Svenjamin',
        email: 'svenjamin@test.com',
        vorname: 'Sven',
        nachname: 'Benjamin',
        telefon: '123456789',
        adresse: 'Musterstraße 123',
        plz: '12345',
        ort: 'Musterort',
        seit: '27.01.1975',
        achievments: [{
            title: 'Svenjamin',
            description: 'Verkaufe einen Svenjamin',
            done: true,
            image: 'resources/images/achievments/sven.jpg'
        },
        {
            title: 'Svenjamin',
            description: 'Verkaufe einen Svenjamin',
            done: true,
            image: 'resources/images/achievments/sven.jpg'
        }, {
            title: 'Svenjamin',
            description: 'Verkaufe einen Svenjamin',
            done: true,
            image: 'resources/images/achievments/sven.jpg'
        }, {
            title: 'Svenjamin',
            description: 'Verkaufe einen Svenjamin',
            done: true,
            image: 'resources/images/achievments/sven.jpg'
        }, {
            title: 'Svenjamin',
            description: 'Verkaufe einen Svenjamin',
            done: false,
            image: 'resources/images/achievments/sven.jpg'
        }, {
            title: 'Svenjamin',
            description: 'Verkaufe einen Svenjamin',
            done: false,
            image: 'resources/images/achievments/sven.jpg'
        }]
    }
    return view.render('pages/base', { page: 'pages/user/konto', konto })
})*/

router.get('/konto', [UsersController, 'konto'])

router.post('/konto', [UsersController, 'updateProfile'])

router.get('meine-anzeigen', [ListingsController, 'myListings'])

router.get('/anzeige-aufgeben', [ListingsController, 'createForm'])

router.post('/anzeige-aufgeben', [ListingsController, 'createProcess'])

router.get('/anzeige/:id/bearbeiten', [ListingsController, 'editForm'])

router.post('/anzeige/:id/bearbeiten', [ListingsController, 'editProcess'])

router.get('/anzeige/:id/deaktivieren', [ListingsController, 'deactivate'])

router.get('/anzeige/:id/verkauft', [ListingsController, 'sold'])

router.get('/anzeige/:id', [ListingsController, 'show']) 

router.put('anzeige/save/:id', [UsersController, 'saveListing'])

router.put('anzeige/unsave/:id', [UsersController, 'unsaveListing'])