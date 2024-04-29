import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions';
import User from '#models/user';
import Image from '#models/image';
import Message from '#models/message';
import Listing from '#models/listing';

export default class ChatsController {
    
    async displayChatOverview({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }

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

    async displayChat({ view, response, session, request }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const listing =  await Listing.find(request.params().id)
        if(!listing) {
            throw new Exception('Not found', { status: 404 })
        }
        if (user.username !== request.params().username && user.username !== listing.username) {
            throw new Exception('Unauthorized', { status: 403 })
        }

        let other =  
        await User.find(user.username === request.params().username ? listing.username : request.params().username)
        

        const listingImage = await Image.findBy('listing_id', request.params().id)

        // irgendwie findet der die methode nicht :C
        //const chat = await Message.findMany([ {listing_id: request.params().id, username: request.params().username} ])
        const chat = await Message.query().where('listing_id', request.params().id).where('username', request.params().username)
        console.log(chat)
        if (!chat) {
            return view.render('layouts/base', { page: 'pages/errors/not_found' })
        }
        return view.render('layouts/chat', { page: 'pages/user/chat', title: 'Chat', chat, user, other, listing, listingImage })
    }

    async processChatMessage({ request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }

        await Message.create({
            listing_id: request.params().id,
            username: request.params().username,
            content: request.input('message'),
            sendername: user.username
        })
        return response.redirect('back')
    }

}
