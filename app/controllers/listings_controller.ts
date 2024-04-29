import type { HttpContext } from '@adonisjs/core/http'
import app from "@adonisjs/core/services/app";
import { cuid } from '@adonisjs/core/helpers'
import sharp from 'sharp'
import { Exception } from '@adonisjs/core/exceptions';
import Listing from '#models/listing';
import Image from '#models/image';
import User from '#models/user';
import Saved from '#models/saved';

export default class ListingsController {

    async show({ request, view, session }: HttpContext) {
        const user = session.get('user') || null

        const anzeige = await Listing.find(request.params().id)

        if (!anzeige) {
            throw new Exception('Not found', { status: 404 })
        }

        const images = await Image.findManyBy('listing_id', anzeige.id)
        const poster = await User.find(anzeige.username)
        const saved = user ? await Saved.findBy({username: user.username, listing_id: request.params().id}) : null
        return view.render('layouts/anzeige', { page: 'pages/anzeige/anzeige', anzeige: anzeige, poster, user, title: anzeige.title, images, saved })
    }

    async createForm({ view, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        return view.render('layouts/anzeige', { page: 'pages/anzeige/anzeige-aufgeben', title: 'Anzeige aufgeben' })
    }

    async createProcess({ view, request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }

        const images = request.files('images', { size: '4mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] })
        if (!images === null) {
            return view.render('layouts/anzeige', { page: 'pages/anzeige/anzeige-aufgeben', error: 'Bitte füge ein Bild hinzu' })
        }

        console.log(images)

        const tmpListing = new Listing()
        tmpListing.username = user.username
        tmpListing.title = request.input('title')
        tmpListing.description = request.input('description')
        tmpListing.price = parseFloat(request.input('price')).toFixed(2)
        tmpListing.negotiable = request.input('negotiable') || false
        tmpListing.shipping = request.input('shipping') || false
        tmpListing.shipping_price = parseFloat(request.input('shipping_price')).toFixed(2)

        const result = await tmpListing.save()

        // Bewusste Entscheidung, browser nicht zu unterstützen, die kein webp können. Wer seit 5 Jahren kein browser update mehr gemacht hat selbst schuld
        images.forEach(async (image) => {
            const tmpCuid = cuid();
            await sharp(image.tmpPath).toFile(app.publicPath(`/anzeigen/${tmpCuid}.webp`))
            await new Image().fill({ path: `${tmpCuid}.webp`, listing_id: result.id }).save()
        })

        return response.redirect('/meine-anzeigen')
    }

    async editForm({ view, request, session, response }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const anzeige = await Listing.find(request.params().id)
        if (!anzeige) {
            throw new Exception('Not found', { status: 404 })
        } else if (anzeige.username !== user.username) {
            throw new Exception('Unauthorized', { status: 403 })
        }
        const images = await Image.findManyBy('listing_id', anzeige.id)
        return view.render('layouts/anzeige', { page: 'pages/anzeige/anzeige-bearbeiten', title: 'Anzeige bearbeiten', anzeige, images })
    }

    async editProcess({ request, response, session }: HttpContext) {
        const user = session.get('user')
        const listing = await Listing.find(request.params().id)

        if (!user) {
            return response.redirect('/login')
        } else if (!listing) {
            throw new Exception('Not found', { status: 404})
        } else if (user.username !== listing.username) {
            throw new Exception('Unauthorized', { status: 403 })
        }

        listing.title = request.input('title')
        listing.description = request.input('description')
        listing.price = parseFloat(request.input('price')).toFixed(2)
        listing.negotiable = request.input('negotiable')
        listing.shipping = request.input('shipping')
        listing.shipping_price = parseFloat(request.input('shipping_price')).toFixed(2)
        await listing.save()

        response.redirect('/meine-anzeigen')
    }

    async changeState({ request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const anzeige = await Listing.find(request.params().id)
        if (!anzeige) {
            return response.redirect('/meine-anzeigen')
        } else if (anzeige.username !== user.username) {
            throw new Exception('Unauthorized', { status: 403 })
        }
        await Listing.find(request.params().id).then((listing) => {
            listing?.merge({ status: request.url().includes('verkauft') ? 'sold' : 'inactive' }).save()
        })
        return response.redirect('/meine-anzeigen')
    }

}