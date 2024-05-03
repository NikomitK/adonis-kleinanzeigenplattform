import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
export default class HomeController {

    async home({ view, auth }: HttpContext) {
        const user = await auth.check() ? auth.user! : null

        const products = await db.from('listings')
            .select('listings.*', 'images.path')
            .join('images', 'listings.id', '=', 'images.listing_id')
            .where('listings.username', '!=', user ? user.username : '')
            .where('listings.status', '=', 'active')
            .where('listings.id', 'not in', db.from('saveds').select('listing_id').where('username', user ? user.username : ''))
            .groupBy('listings.id')
            .orderBy('listings.id', "desc")

        return view.render('layouts/base', { page: 'pages/anzeige/home', products, user })
    }

    async myListings({ view, auth }: HttpContext) {
        const user = auth.user!

        const meineAnzeigen = await db.from('listings')
            .select('listings.*', 'images.path')
            .join('images', 'listings.id', '=', 'images.listing_id')
            .where('listings.username', user.username)
            .groupBy('listings.id')
            .orderBy('listings.id', "desc")

        return view.render('layouts/base', { page: 'pages/anzeige/meine-anzeigen', meineAnzeigen, title: 'Meine Anzeigen' })
    }

    async savedListings({ view, auth }: HttpContext) {
        const user = auth.user!

        const gespeichert = await db.from('listings')
            .select('listings.*', 'images.path')
            .join('images', 'listings.id', '=', 'images.listing_id')
            .join('saveds', 'listings.id', '=', 'saveds.listing_id')
            .where('saveds.username', user.username)
            .where('listings.status', '=', 'active')
            .groupBy('listings.id')
            .orderBy('listings.id', "desc")

        return view.render('layouts/base', { page: 'pages/anzeige/gespeichert', gespeichert, title: 'Gespeicherte Anzeigen', user })
    }
}