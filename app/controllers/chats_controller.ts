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
        .join('listing', 'messages.listing_id', 'listing.id')
        .join('image', 'listing.id', 'image.listing_id')
        .where('listing.username', user.username)
        .groupBy('messages.listing_id', 'messages.username')
        .select('messages.*', 'listing.title', 'listing.username as poster', 'messages.username as other', 'image.path')

        const foreignChats = await db.from('messages')
        .join('listing', 'messages.listing_id', 'listing.id')
        .join('image', 'listing.id', 'image.listing_id')
        .where('messages.username', user.username)
        .groupBy('messages.listing_id')
        .select('messages.*', 'listing.title', 'listing.username as other', 'messages.username as poster', 'image.path')

        return view.render('layouts/chat', { page: 'pages/user/chat_overview', foreignChats, ownChats, title: 'Chats', user })
    }

    async displayChat({ view, response, session, request }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const listing = await db.from('listing').where('id', request.params().id).first()
        if (user.username !== request.params().username && user.username !== listing.username) {
            throw new Exception('Unauthorized', { status: 403 })
        }

        let other = user.username === request.params().username ? await db.from('user').where('username', listing.username).first() : await db.from('user').where('username', request.params().username).first()


        const listingImage = await db.from('image').where('listing_id', request.params().id).first()

        //TODO
        const chat = await db.rawQuery(`SELECT m.* from messages m, listing l WHERE m.listing_id = l.id AND l.id = ${request.params().id} AND m.username = '${request.params().username}'`)
        //const chat = await db.from('messages').where('username', user.username).where('listing_id', request.params().id)
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
