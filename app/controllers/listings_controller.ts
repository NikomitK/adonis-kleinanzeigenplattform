import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { table } from 'console'

export default class ListingsController {

    async home({ view, session }: HttpContext) {
        const user = session.get('user')
        const products = await db.from('listing')
            .select('listing.*', 'image.path')
            .join('image', 'listing.id', '=', 'image.listing_id')
            .where('listing.username', '!=', user ? user.username : '')
            .where('listing.id', 'not in', db.from('saved').select('listing_id').where('username', user ? user.username : ''))

        return view.render('pages/base', { page: 'pages/anzeige/home', products, user})
    }

    async show({ request, view, session }: HttpContext) {
        const user = session.get('user')
        const anzeige = await db.from('listing')
            .select('listing.*', 'image.path')
            .join('image', 'listing.id', '=', 'image.listing_id')
            .where('listing.id', request.params().id)
            .first()

        if (!anzeige) {
            return view.render('pages/base', { page: 'pages/errors/not_found' })
        }
        const poster = await db.from('user').where('username', anzeige.username).first()
        return view.render('pages/base', { page: 'pages/anzeige/anzeige', anzeige: anzeige, poster, user: user ? user : null, title: anzeige.title })
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
        return view.render('pages/base', { page: 'pages/anzeige/meine-anzeigen', meineAnzeigen, title: 'Meine Anzeigen'})
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

        return view.render('pages/base', { page: 'pages/anzeige/gespeichert', gespeichert, title: 'Gespeicherte Anzeigen'})
    }

    async createForm({ view, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        return view.render('pages/base', { page: 'pages/anzeige/anzeige-aufgeben', title: 'Anzeige aufgeben'})
    }

    async createProcess({ view, request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }

        const title = request.input('title')
        const description = request.input('description')
        const price = request.input('price')
        const negotiable = request.input('negotiable')
        const shipping = request.input('shipping')
        const shipping_price = request.input('shipping_price')

        const result = await db.table('listing').insert({ title, description, username: user.username, price, negotiable, shipping, shipping_price })
        const imageresult = await db.table('image').insert({ path: 'resources/images/sven.jpg', listing_id: result[0] })
        response.redirect('/meine-anzeigen')
    }

}