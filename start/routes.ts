/*
|--------------------------------------------------------------------------
| Routes file sass --watch "web engineering 2\Kleinanzeigen-proto\scss":Kleinanzeigenplattform\resources\css
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
            image: 'https://placehold.co/150x100',
            description: 'Hat ein paar kleine Kratzer und Dellen, aber das ist der Charakterdes Autos.'
        },
        {
            name: 'Apple google',
            price: 100,
            image: 'https://placehold.co/150x100',
            description: 'Apple google'
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
        {
            name: 'Apple google',
            price: 100,
            image: 'https://placehold.co/150x100',
            description: 'Apple google'
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
    return view.render('pages/base', { page: 'pages/konto' })
})
