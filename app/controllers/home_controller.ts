import Listing from '#models/listing'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
export default class HomeController {

    async home({ view, auth, request }: HttpContext) {
        // Der auth.check() call ist nötig, da die route nicht von der middleware protected ist, weshalb das auth.user nicht ohne den check funktionieren kann
        const user = await auth.check() ? auth.user! : null

        let anzeigen = await db.from('listings')
            .select('listings.*', 'images.path')
            .join('images', 'listings.id', '=', 'images.listing_id')
            .where('listings.username', '!=', user ? user.username : '')
            .where('listings.status', '=', 'active')
            .where('listings.id', 'not in', db.from('saveds').select('listing_id').where('username', user ? user.username : ''))
            .groupBy('listings.id')
            .orderBy('listings.id', "desc")

        const search = request.input('search')
        if (search) {
            anzeigen = anzeigen.filter((anzeige: Listing) => {
                return anzeige.title.toLowerCase().includes(search.toLowerCase())
            })
        }

        return view.render('layouts/base', { page: 'pages/anzeige/home', anzeigen, user, search })
    }

    async myListings({ view, auth, request }: HttpContext) {
        const user = auth.user!

        let anzeigen = await db.from('listings')
            .select('listings.*', 'images.path')
            .join('images', 'listings.id', '=', 'images.listing_id')
            .where('listings.username', user.username)
            .groupBy('listings.id')
            .orderBy('listings.id', "desc")

        const search = request.input('search')
        if (search) {
            anzeigen = anzeigen.filter((anzeige: Listing) => {
                return anzeige.title.toLowerCase().includes(search.toLowerCase())
            })
        }

        return view.render('layouts/base', { page: 'pages/anzeige/meine-anzeigen', anzeigen, title: 'Meine Anzeigen', search })
    }

    async savedListings({ view, auth, request }: HttpContext) {
        const user = auth.user!

        let anzeigen = await db.from('listings')
            .select('listings.*', 'images.path')
            .join('images', 'listings.id', '=', 'images.listing_id')
            .join('saveds', 'listings.id', '=', 'saveds.listing_id')
            .where('saveds.username', user.username)
            .where('listings.status', '=', 'active')
            .groupBy('listings.id')
            .orderBy('listings.id', "desc")

        const search = request.input('search')
        if (search) {
            anzeigen = anzeigen.filter((anzeige: Listing) => {
                return anzeige.title.toLowerCase().includes(search.toLowerCase())
            })
        }

        return view.render('layouts/base', { page: 'pages/anzeige/gespeichert', anzeigen, title: 'Gespeicherte Anzeigen', user, search })
    }
}