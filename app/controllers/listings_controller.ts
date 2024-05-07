import type { HttpContext } from '@adonisjs/core/http'
import app from "@adonisjs/core/services/app";
import { cuid } from '@adonisjs/core/helpers'
import sharp from 'sharp'
import { Exception } from '@adonisjs/core/exceptions';
import Listing from '#models/listing';
import Image from '#models/image';
import User from '#models/user';
import Saved from '#models/saved';
import { lisitingFormValidator } from '#validators/listing';

export default class ListingsController {

    async show({ request, view, auth }: HttpContext) {
        const user = await auth.check() ? auth.user! : null

        const anzeige = await Listing.find(request.params().id)

        if (!anzeige) {
            throw new Exception('Not found', { status: 404 })
        }

        const images = await Image.findManyBy('listing_id', anzeige.id)
        const poster = await User.find(anzeige.username)
        const saved = user ? await Saved.findBy({username: user.username, listing_id: request.params().id}) : null
        return view.render('layouts/anzeige', { page: 'pages/anzeige/anzeige', anzeige: anzeige, poster, user, title: anzeige.title, images, saved })
    }

    async createForm({ view }: HttpContext) {
        return view.render('layouts/anzeige', { page: 'pages/anzeige/anzeige-aufgeben', title: 'Anzeige aufgeben' })
    }

    async createProcess({ view, request, response, auth }: HttpContext) {
        const user = auth.user!

        const images = request.files('images', { extnames: ['jpg', 'png', 'jpeg', 'webp'] })

        if (!images === null) {
            return view.render('layouts/anzeige', { page: 'pages/anzeige/anzeige-aufgeben', error: 'Bitte füge ein Bild hinzu' })
        }

        const { title, description, price, shipping_price} = await request.validateUsing(lisitingFormValidator)
        
        const tmpListing = new Listing()
        tmpListing.username = user.username
        tmpListing.title = title
        tmpListing.description = description
        tmpListing.price = price
        tmpListing.negotiable = request.input('negotiable') || false
        tmpListing.shipping = request.input('shipping') || false
        tmpListing.shipping_price = shipping_price ?? '0.00'

        const result = await tmpListing.save()

        // Bewusste Entscheidung, browser nicht zu unterstützen, die kein webp können. Wer seit 5 Jahren kein browser update mehr gemacht hat selbst schuld. Performance- und Speicher-impact sind relevant größer
        for await (const image of images) {
            const tmpCuid = cuid();
            await sharp(image.tmpPath).toFile(app.publicPath(`/anzeigen/${tmpCuid}.webp`))
            await new Image().fill({ path: `${tmpCuid}.webp`, listing_id: result.id }).save()
        }

        return response.redirect(`/anzeige/${result.id}`)
    }

    async editForm({ view, request, auth }: HttpContext) {
        const user = auth.user!

        const anzeige = await Listing.find(request.params().id)

        if (!anzeige) {
            throw new Exception('Not found', { status: 404 })
        } else if (anzeige.username !== user.username) {
            throw new Exception('Unauthorized', { status: 403 })
        }

        const images = await Image.findManyBy('listing_id', anzeige.id)

        return view.render('layouts/anzeige', { page: 'pages/anzeige/anzeige-bearbeiten', title: 'Anzeige bearbeiten', anzeige, images })
    }

    async editProcess({ request, response, auth }: HttpContext) {
        const user = auth.user!
        const listing = await Listing.find(request.params().id)

        if (!listing) {
            throw new Exception('Not found', { status: 404})
        } else if (user.username !== listing.username) {
            throw new Exception('Unauthorized', { status: 403 })
        }

        const { title, description, price, shipping_price} = await request.validateUsing(lisitingFormValidator)

        listing.title = title
        listing.description = description
        listing.price = price
        listing.negotiable = request.input('negotiable') ?? false
        listing.shipping = request.input('shipping') ?? false
        listing.shipping_price = shipping_price ?? '0.00'
        await listing.save()

        response.redirect('/meine-anzeigen')
    }

    async changeState({ request, response, auth }: HttpContext) {
        const user = auth.user!

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