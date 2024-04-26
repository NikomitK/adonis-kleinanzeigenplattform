import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
export default class HomeController {
    
    async home({ view, session }: HttpContext) {
        const user = session.get('user')
        const products = await db.from('listing')
            .select('listing.*', 'image.path')
            .join('image', 'listing.id', '=', 'image.listing_id')
            .where('listing.username', '!=', user ? user.username : '')
            .where('listing.status', '=', 'active')
            .where('listing.id', 'not in', db.from('saved').select('listing_id').where('username', user ? user.username : ''))
            .groupBy('listing.id')
            .orderBy('listing.id', "desc")

        return view.render('layouts/base', { page: 'pages/anzeige/home', products, user })
    }
    
    async myListings({ view, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const meineAnzeigen = await db.from('listing')
            .select('listing.*', 'image.path')
            .join('image', 'listing.id', '=', 'image.listing_id')
            .where('listing.username', user.username)
            .groupBy('listing.id')
            .orderBy('listing.id', "desc")

        return view.render('layouts/base', { page: 'pages/anzeige/meine-anzeigen', meineAnzeigen, title: 'Meine Anzeigen' })
    }
    
    async savedListings({ view, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const gespeichert = await db.from('listing')
            .select('listing.*', 'image.path')
            .join('image', 'listing.id', '=', 'image.listing_id')
            .join('saved', 'listing.id', '=', 'saved.listing_id')
            .where('saved.username', user.username)
            .where('listing.status', '=', 'active')
            .groupBy('listing.id')
            .orderBy('listing.id', "desc")

        return view.render('layouts/base', { page: 'pages/anzeige/gespeichert', gespeichert, title: 'Gespeicherte Anzeigen', user })
    }
}