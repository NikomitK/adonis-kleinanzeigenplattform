import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions';

export default class ChatsController {
    
    async displayChatOverview({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }

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
        const listing = await db.from('listings').where('id', request.params().id).first()
        if (user.username !== request.params().username && user.username !== listing.username) {
            throw new Exception('Unauthorized', { status: 403 })
        }

        let other =  
        await db.from('users')
        .where('username', user.username === request.params().username ?listing.username : request.params().username)
        .first() 
        

        const listingImage = await db.from('images')
        .where('listing_id', request.params().id)
        .first()

        const chat = await db.from('messages')
        .where('listing_id', request.params().id)
        .where('username', request.params().username)

        if (!chat) {
            return view.render('layouts/base', { page: 'pages/errors/not_found' })
        }
        //console.log(chat)
        return view.render('layouts/chat', { page: 'pages/user/chat', title: 'Chat', chat, user, other, listing, listingImage })
    }

    async processChatMessage({ request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        let message = request.input('message');
        console.log(message)
        console.log(message)
        await db.table('messages').insert({ listing_id: request.params().id, username: request.params().username, content: request.input('message'), sendername: user.username })
        return response.redirect('back')
    }

}
