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
import db from '@adonisjs/lucid/services/db'

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

router.get('/', async ({ view }) => {
    const products = await db.rawQuery('SELECT listing.*, image.path FROM listing, image WHERE listing.id = image.listing_id')
    console.log(products)
    return view.render('pages/base', { page: 'pages/home', products })
})

router.get('/register', async ({ view }) => {
    return view.render('pages/base', { page: 'pages/register' })
})

router.get('/login', async ({ view }) => {
    return view.render('pages/base', { page: 'pages/login' })
})

router.get('/gespeichert', async ({ view }) => {
    const gespeichert = await db.rawQuery("SELECT listing.*, image.path FROM listing, image, saved WHERE listing.id = image.listing_id AND saved.username = 'nikomitk' AND saved.listing_id = listing.id")
    console.log('gespeichert', gespeichert)
    return view.render('pages/base', { page: 'pages/gespeichert', gespeichert })
})

router.get('/konto', async ({ view }) => {
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
    return view.render('pages/base', { page: 'pages/konto', konto })
})

router.get('meine-anzeigen', async ({ view }) => {
    const meineAnzeigen = await db.rawQuery("SELECT listing.*, image.path FROM listing, image WHERE listing.id = image.listing_id AND listing.username = 'nikomitk'")
    return view.render('pages/base', { page: 'pages/meine-anzeigen', meineAnzeigen })
})

router.get('/anzeige-aufgeben', async ({ view }) => {
    return view.render('pages/base', { page: 'pages/anzeige-aufgeben' })
})

router.post('/anzeige-aufgeben', async ({ request, response }) => {
    const title = request.input('title')
    const description = request.input('description')
    const price = request.input('price')

    const result = await db.table('listing').insert({title, description, username: 'nikomitk', price })
    const imageresult = await db.table('image').insert({ path: 'resources/images/sven.jpg', listing_id: result[0] })
    response.redirect('/meine-anzeigen')
})

router.get('/anzeige/:id', async ({ request, view }) => {
    const anzeige = await db.rawQuery(`
    SELECT listing.*, image.path 
    FROM listing, image 
    WHERE listing.id = image.listing_id 
    AND listing.id = ${request.params().id}
    LIMIT 1`)
    return view.render('pages/base', { page: 'pages/anzeige', anzeige: anzeige[0] })
})

router.post('anzeige/save/:id', async ({ request, response }) => {
    const result = await db.table('saved').insert({ listing_id: request.params().id, username: 'nikomitk' })
    response.redirect('/gespeichert')
})