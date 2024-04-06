import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ListingsController {

    async home({ view}: HttpContext) {
        const products = await db.rawQuery('SELECT listing.*, image.path FROM listing, image WHERE listing.id = image.listing_id')
        return view.render('pages/base', { page: 'pages/anzeige/home', products })
    }

    async show({ request, view }: HttpContext) {
        const anzeige = await db.rawQuery(`
        SELECT listing.*, image.path 
        FROM listing, image 
        WHERE listing.id = image.listing_id 
        AND listing.id = ${request.params().id}
        LIMIT 1`)
        return view.render('pages/base', { page: 'pages/anzeige/anzeige', anzeige: anzeige[0] })
    }

    async myListings({ view, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const meineAnzeigen = await db.rawQuery(`SELECT listing.*, image.path FROM listing, image WHERE listing.id = image.listing_id AND listing.username = '${user.username}'`)
        return view.render('pages/base', { page: 'pages/anzeige/meine-anzeigen', meineAnzeigen })
    }

    async savedListings({ view, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const gespeichert = await db.rawQuery(`SELECT listing.*, image.path FROM listing, image, saved WHERE listing.id = image.listing_id AND saved.username = '${user.username}' AND saved.listing_id = listing.id`)
        return view.render('pages/base', { page: 'pages/anzeige/gespeichert', gespeichert })
    }

    async createForm({ view, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        return view.render('pages/base', { page: 'pages/anzeige/anzeige-aufgeben' })
    }

    async createProcess({ view, request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }

        const title = request.input('title')
    const description = request.input('description')
    const price = request.input('price')

    const result = await db.table('listing').insert({title, description, username: 'nikomitk', price })
    const imageresult = await db.table('image').insert({ path: 'resources/images/sven.jpg', listing_id: result[0] })
    response.redirect('/meine-anzeigen')
}

}