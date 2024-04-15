import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import app from "@adonisjs/core/services/app";
import { cuid } from '@adonisjs/core/helpers'

export default class ListingsController {

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

        const images = await db.from('image').where('listing_id', anzeige.id)

        const poster = await db.from('user').where('username', anzeige.username).first()
        return view.render('pages/base', { page: 'pages/anzeige/anzeige', anzeige: anzeige, poster, user: user ? user : null, title: anzeige.title, images })
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
            .where('listing.status', '=', 'active')
            .groupBy('listing.id')
            .orderBy('listing.id', "desc")

        return view.render('pages/base', { page: 'pages/anzeige/gespeichert', gespeichert, title: 'Gespeicherte Anzeigen', user})
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

        const images = request.files('images', { size: '4mb', extnames: ['jpg', 'png', 'jpeg', 'webp']})
        if (!images === null) {
            return view.render('pages/anzeige/anzeige-aufgeben', { error: 'Bitte füge ein Bild hinzu'})
        }

        console.log(images)

        const title = request.input('title')
        const description = request.input('description')
        const price = request.input('price')
        const negotiable = request.input('negotiable')
        const shipping = request.input('shipping')
        const shipping_price = request.input('shipping_price')

        const result = await db.table('listing').insert({ title, description, username: user.username, price: (Math.round(price * 100) / 100).toFixed(2), negotiable, shipping, shipping_price })
        
        images.forEach(async (image) => {
            await image.move(app.publicPath('/anzeigen'), {
                name: `${cuid()}.${image.extname}`,
                overwrite: true
            })
            await db.table('image').insert({ path: image.fileName, listing_id: result[0]})
        })

        response.redirect('/meine-anzeigen')
    }

    async editForm({ view, request, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const anzeige = await db.from('listing').where('id', request.params().id).first()
        if (!anzeige) {
            return view.render('pages/base', { page: 'pages/errors/not_found' })
        } else if(anzeige.username !== user.username) {
            return view.render('pages/base', { page: 'pages/errors/forbidden' })
        }
        return view.render('pages/base', { page: 'pages/anzeige/anzeige-bearbeiten', anzeige, title: 'Anzeige bearbeiten'})
    }

    async editProcess({ request, response, session }: HttpContext) {
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

        const result = await db.from('listing').where('id', request.params().id).update({ title, description, price, negotiable, shipping, shipping_price })
        response.redirect('/meine-anzeigen')
    }

    async deactivate({ request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const anzeige = await db.from('listing').where('id', request.params().id).first()
        if (!anzeige) {
            return response.redirect('/meine-anzeigen')
        } else if(anzeige.username !== user.username) {
            return response.redirect('/meine-anzeigen')
        }
        const result = await db.from('listing').where('id', request.params().id).update({ status: 'inactive' })
        return response.redirect('/meine-anzeigen')
    }

    async sold({ request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const anzeige = await db.from('listing').where('id', request.params().id).first()
        if (!anzeige) {
            return response.redirect('/meine-anzeigen')
        } else if(anzeige.username !== user.username) {
            return response.redirect('/meine-anzeigen')
        }
        const result = await db.from('listing').where('id', request.params().id).update({ status: 'sold' })
        return response.redirect('/meine-anzeigen')
    }

}