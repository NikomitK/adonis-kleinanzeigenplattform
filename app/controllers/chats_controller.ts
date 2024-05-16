import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions';
import User from '#models/user';
import Image from '#models/image';
import Message from '#models/message';
import Listing from '#models/listing';
import Achieved from '#models/achieved';

export default class ChatsController {

    async displayChatOverview({ view, auth }: HttpContext) {
        // auth.user muss den user liefern, weil die route durch die middleware geschützt ist, deshalb !
        const user = auth.user!

        //die langen queries mit join, subqueries, etc. fand ich zu kompliziert, um sie auf die model schreibweise zu übersetzen
        const ownChats = await db.from('messages')
            .join('listings', 'messages.listing_id', 'listings.id')
            .join('images', 'listings.id', 'images.listing_id')
            .where('listings.username', user.username)
            .groupBy('messages.listing_id', 'messages.username')
            .select('messages.*', 'listings.title', 'listings.username as poster', 'messages.username as other', 'images.path')

        const foreignChats = await db.from('messages')
            .join('listings', 'messages.listing_id', 'listings.id')
            .join('images', 'listings.id', 'images.listing_id')
            .where('messages.username', user.username)
            .groupBy('messages.listing_id')
            .select('messages.*', 'listings.title', 'listings.username as other', 'messages.username as poster', 'images.path')

        return view.render('layouts/chat', { page: 'pages/user/chat_overview', foreignChats, ownChats, title: 'Chats', user })
    }

    async displayChat({ view, auth, request, response }: HttpContext) {
        const user = auth.user!
        if(request.params().username === 'null') {
            return response.redirect(`/chat/${request.params().id}/${user.username}`)
        }

        if(request.params().username === user.username) {
            return response.redirect(`/chat-overview`)
        }

        const listing = await Listing.find(request.params().id)
        if (!listing) {
            // Fehlermeldungen nicht mit z.B. response.notFound(), weil ich dann nicht auf die Fehlerseite geleitet werde sondern einfach ganz die connection verloren geht
            throw new Exception('Not found', { status: 404 })
        }
        if (user.username !== request.params().username && user.username !== listing.username) {
            throw new Exception('Forbidden', { status: 403 })
        }

        let other = await User.find(user.username === request.params().username ? listing.username : request.params().username)

        const listingImage = await Image.findBy('listing_id', request.params().id)

        const chat = await Message.query().where('listing_id', request.params().id).where('username', request.params().username)
        if (!chat) {
            throw new Exception('Not found', { status: 404 })
        }
        return view.render('layouts/chat', { page: 'pages/user/chat', title: 'Chat', chat, user, other, listing, listingImage })
    }

    async processChatMessage({ request, response, auth }: HttpContext) {
        const user = auth.user!

        const message = request.input('message')
        if (!message) {
            return response.redirect('back')
        }

        await Message.create({
            listing_id: request.params().id,
            username: request.params().username,
            content: request.input('message'),
            sendername: user.username
        })
        response.redirect('back')

        // Überprüfung, ob achievment erreicht wurde
        user.messageCount++
        await user.save()
        if (user.messageCount === 50) {
            await new Achieved().fill({ username: user.username, title: 'Gesprächs-Enthusiast' }).save()
        }
    }

}
