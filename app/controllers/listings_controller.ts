import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import app from "@adonisjs/core/services/app";
import { cuid } from '@adonisjs/core/helpers'
import sharp from 'sharp'
import { Exception } from '@adonisjs/core/exceptions';

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

        return view.render('pages/base', { page: 'pages/anzeige/home', products, user })
    }

    async show({ request, view, session }: HttpContext) {
        const user = session.get('user') || null
        const anzeige = await db.from('listing')
            .select('listing.*', 'image.path')
            .join('image', 'listing.id', '=', 'image.listing_id')
            .where('listing.id', request.params().id)
            .first()

        if (!anzeige) {
            throw new Exception('Not found', { status: 404 })
        }

        const images = await db.from('image').where('listing_id', anzeige.id)

        const poster = await db.from('user').where('username', anzeige.username).first()
        const saved = user ? await db.from('saved').where('username', user.username).where('listing_id', anzeige.id).first() : null
        return view.render('pages/base', { page: 'pages/anzeige/anzeige', anzeige: anzeige, poster, user, title: anzeige.title, images, saved })
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

        return view.render('pages/base', { page: 'pages/anzeige/meine-anzeigen', meineAnzeigen, title: 'Meine Anzeigen' })
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

        return view.render('pages/base', { page: 'pages/anzeige/gespeichert', gespeichert, title: 'Gespeicherte Anzeigen', user })
    }

    async createForm({ view, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        return view.render('pages/base', { page: 'pages/anzeige/anzeige-aufgeben', title: 'Anzeige aufgeben' })
    }

    async createProcess({ view, request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }

        const images = request.files('images', { size: '4mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] })
        if (!images === null) {
            return view.render('pages/anzeige/anzeige-aufgeben', { error: 'Bitte füge ein Bild hinzu' })
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
            const tmpCuid = cuid();
            await sharp(image.tmpPath).toFile(app.publicPath(`/anzeigen/${tmpCuid}.webp`))
            await db.table('image').insert({ path: `${tmpCuid}.webp`, listing_id: result[0]})
        })

        return response.redirect('/meine-anzeigen')
    }

    async editForm({ view, request, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const anzeige = await db.from('listing').where('id', request.params().id).first()
        if (!anzeige) {
            throw new Exception('Not found', { status: 404 })
        } else if (anzeige.username !== user.username) {
            throw new Exception('Unauthorized', { status: 403 })
        }
        const images = await db.from('image').where('listing_id', anzeige.id)
        return view.render('pages/base', { page: 'pages/anzeige/anzeige-bearbeiten', title: 'Anzeige bearbeiten', anzeige, images })
    }

    async editProcess({ request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        } else if(user.username !== (await db.from('listing').where('id', request.params().id).first()).username) {
            throw new Exception('Unauthorized', { status: 403 })
        }
        const title = request.input('title')
        const description = request.input('description')
        const price = request.input('price')
        const negotiable = request.input('negotiable')
        const shipping = request.input('shipping')
        const shipping_price = request.input('shipping_price')

        await db.from('listing').where('id', request.params().id).update({ title, description, price, negotiable, shipping, shipping_price })
        response.redirect('/meine-anzeigen')
    }

    async changeState({ request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const anzeige = await db.from('listing').where('id', request.params().id).first()
        if (!anzeige) {
            return response.redirect('/meine-anzeigen')
        } else if (anzeige.username !== user.username) {
            throw new Exception('Unauthorized', { status: 403 })
        }
        await db.from('listing').where('id', request.params().id).update({ status: request.url().includes('verkauft') ? 'sold' : 'inactive'})
        return response.redirect('/meine-anzeigen')
    }

}