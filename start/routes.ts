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

router.get('/', async ({ view }) => {
    const products = [
        {
            name: 'Fast neues Auto',
            price: 100,
            image: 'resources/images/auto.webp',
            description: 'Hat ein paar kleine Kratzer und Dellen, aber das ist der Charakterdes Autos.'
        },
        {
            name: 'Apple google',
            price: 100,
            image: 'resources/images/apple-google.jpg',
            description: 'Apple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple google'
        },
        {
            name: 'Alles',
            price: 100,
            image: 'resources/images/alles.jpg',
            description: 'Ich verkaufe alles was existiert.'
        },
        {
            name: 'Svenjamin',
            price: 100,
            image: 'resources/images/sven.jpg',
            description: 'Some quick example text to build on the card title and make up the bulk of the cards content.'
        },
        {
            name: 'Apple google',
            price: 100,
            image: 'resources/images/apple-google.jpg',
            description: 'Apple google'
        },
        {
            name: 'Alles',
            price: 100,
            image: 'resources/images/alles.jpg',
            description: 'Ich verkaufe alles was existiert.'
        },
        {
            name: 'Svenjamin',
            price: 100,
            image: 'resources/images/sven.jpg',
            description: 'Some quick example text to build on the card title and make up the bulk of the cards content.'
        }
    ]
    return view.render('pages/base', { page: 'pages/home', products })

})

router.get('/register', async ({ view }) => {
    return view.render('pages/base', { page: 'pages/register' })
})

router.get('/login', async ({ view }) => {
    return view.render('pages/base', { page: 'pages/login' })
})

router.get('/gespeichert', async ({ view }) => {
    const gespeichert = [
        {
            name: 'Fast neues Auto',
            price: 100,
            image: 'https://placehold.co/150x100',
            description: 'Hat ein paar kleine Kratzer und Dellen, aber das ist der Charakterdes Autos.'
        },
        {
            name: 'Alles',
            price: 100,
            image: 'https://placehold.co/150x100',
            description: 'Ich verkaufe alles was existiert.'
        },
        {
            name: 'Svenjamin',
            price: 100,
            image: 'https://placehold.co/150x100',
            description: 'Some quick example text to build on the card title and make up the bulk of the cards content.'
        },
    ]
    return view.render('pages/base', { page: 'pages/gespeichert', gespeichert})
})

router.get('/konto' , async ({ view }) => {
    const konto = {
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
        },{
            title: 'Svenjamin',
            description: 'Verkaufe einen Svenjamin',
            done: true,
            image: 'resources/images/achievments/sven.jpg'
        },{
            title: 'Svenjamin',
            description: 'Verkaufe einen Svenjamin',
            done: true,
            image: 'resources/images/achievments/sven.jpg'
        },{
            title: 'Svenjamin',
            description: 'Verkaufe einen Svenjamin',
            done: false,
            image: 'resources/images/achievments/sven.jpg'
        },{
            title: 'Svenjamin',
            description: 'Verkaufe einen Svenjamin',
            done: false,
            image: 'resources/images/achievments/sven.jpg'
        }]
    }
    return view.render('pages/base', { page: 'pages/konto', konto })
})

router.get('meine-anzeigen', async ({ view }) => {
    const meineAnzeigen = [
        {
            name: 'Apple google',
            price: 100,
            image: 'https://placehold.co/150x100',
            description: 'Apple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple googleApple google'
        },
        {
            name: 'Gniesbert',
            price: 999999,
            image: 'resources/images/gniesbert.png',
            description: 'Mein scheiss Hund Gniesbert ist schon wieder in meinen Gaming pc geklettert, weshalb ich ihn verkaufen muss. Er ist 3 Jahre alt und hat schon 2 mal meinen Gaming pc zerstört. Ich verkaufe ihn für 999999€. Versand ist möglich, er läuft dann zu dir.'
        }
    ]
    return view.render('pages/base', { page: 'pages/meine-anzeigen', meineAnzeigen })
})

router.get('/anzeige-aufgeben', async ({ view }) => {
    return view.render('pages/base', { page: 'pages/anzeige-aufgeben' })
})

router.post('/anzeige-aufgeben', async ({ request, response }) => {
    console.log(request.input('title'))
    console.log(request.input('description'))
    console.log(request.input('price'))
    console.log(request.input('negotiable'))
    console.log(request.input('shipping'))
    console.log(request.input('shipping-price'))
    //console.log(request.input('image'))
    response.redirect('/meine-anzeigen')
})