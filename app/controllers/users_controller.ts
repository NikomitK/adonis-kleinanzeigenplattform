import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash';
import { messages } from '@vinejs/vine/defaults';
import app from '@adonisjs/core/services/app';

export default class UsersController {
    async loginForm({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (user) {
            return response.redirect('back')
        }
        return view.render('pages/base', { page: 'pages/user/login', title: 'Login' })
    }

    async loginProcess({ view, request, response, session }: HttpContext) {
        if (session.get('user')) {
            return response.redirect('back')
        }
        const result = await db.from('user').where('username', request.input('username')).first();
        if (!result) {
            console.log('User not found');
            return view.render('pages/base', { page: 'pages/user/login', error: 'Invalid username or password' });
        }
        const passwordOk = await hash.verify(result.password, request.input('password'))
        if (!passwordOk) {
            return view.render('pages/base', { page: 'pages/user/login', error: 'Invalid username or password' });
        }
        session.put('user', { username: result.username, firstname: result.firstname, lastname: result.lastname, email: result.email, number: result.number, since: result.since, picture: result.picture })
        console.log('User logged in')
        return response.redirect('/');
    }

    async registerForm({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (user) {
            return response.redirect('back')
        }
        return view.render('pages/base', { page: 'pages/user/register', title: 'Registrieren' })
    }

    async registerProcess({ view, request, response, session }: HttpContext) {
        if (session.get('user')) {
            return response.redirect('back')
        }
        const username = request.input('username')

        if (await db.from('user').where('username', username).first()) {
            return view.render('pages/base', { page: 'pages/user/register', title: 'Registrieren', usernameTaken: true })
        }

        const email = request.input('email')

        if (await db.from('user').where('email', email).first()) {
            return view.render('pages/base', { page: 'pages/user/register', title: 'Registrieren', emailTaken: true })
        }

        const password = request.input('password')
        const passwordRepeat = request.input('password-repeat')

        if(password !== passwordRepeat) {
            return view.render('pages/base', { page: 'pages/user/register', title: 'Registrieren', passwordMismatch: true })
        }

        const hashedPassword = await hash.make(request.input('password'));
        const now = new Date();
        try {
            const result = await db.table('user')
                .insert({ username: request.input('username'), password: hashedPassword, firstname: request.input('firstname'), lastname: request.input('lastname'), since: now, email: request.input('email') })
            response.redirect('/');
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async logout({ response, session }: HttpContext) {
        session.clear()
        return response.redirect('/')
    }

    async konto({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const unAchieved = await db.from('achievment').whereNotIn('title', db.from('achieved').where('username', user.username).select('title'))
        const achieved = await db.from('achievment').whereIn('title', db.from('achieved').where('username', user.username).select('title'))
        return view.render('pages/base', { page: 'pages/user/konto', user, achieved, unAchieved, title: 'Konto' })
    }

    async updateProfile({ request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }

        let picture = request.file('image', { size: '3mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] })

        if (!picture?.isValid) {
            picture = null;
        } else {
            await picture.move(app.publicPath('/profile'), {
                name: `${user.username}.${picture.extname}`,
                overwrite: true
            })
        }

        const result = await db.from('user').where('username', user.username).update({
            firstname: request.input('firstname') ? request.input('firstname') : user.firstname,
            lastname: request.input('lastname') ? request.input('lastname') : user.lastname,
            email: request.input('email') ? request.input('email') : user.email,
            number: request.input('number') ? request.input('number') : user.number,
            picture: picture ? picture.fileName : user.picture
        })

        const updatedUser = await db.from('user').where('username', user.username).first()

        session.put('user', { username: updatedUser.username, firstname: updatedUser.firstname, lastname: updatedUser.lastname, email: updatedUser.email, number: updatedUser.number, since: updatedUser.since, picture: updatedUser.picture })
        return response.redirect('/konto')
    }

    async saveListing({ request, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return
        }
        const result = await db.table('saved').insert({ username: user.username, listing_id: request.params().id })
        //TODO check for errors
    }

    async unsaveListing({ request, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return
        }
        const result = await db.from('saved').where('username', user.username).where('listing_id', request.params().id).delete()
        //TODO check for errors
    }

    async displayChatOverview({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        //const foreignChats = await db.from('messages').where('username', user.username).distinct('listing_id')

        const foreignChats = await db.rawQuery(`SELECT m.*, l.title, l.username AS poster FROM messages m, listing l WHERE m.listing_id = l.id AND m.username = '${user.username}' GROUP BY(m.listing_id)`)

        //const ownChats = await db.from('messages').whereIn('listing_id', foreignChats.map(chat => chat.listing_id)).distinct('username')

        const ownChats = await db.rawQuery(`SELECT m.*, l.title, l.username AS poster FROM messages m, listing l WHERE m.listing_id = l.id AND l.username = '${user.username}' GROUP BY(m.listing_id)`)
        console.log(ownChats)
        console.log(foreignChats)

        return view.render('pages/base', { page: 'pages/user/chat_overview', foreignChats, ownChats, title: 'Chats', user })
    }

    async displayOwnChat({ view, response, session, request }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const listing = await db.from('listing').where('id', request.params().id).first()
        if (user.username !== request.params().username && user.username !== listing.username) {
            return view.render('pages/base', { page: 'pages/errors/forbidden' })
        }
        const chat = await db.rawQuery(`SELECT m.* from messages m, listing l WHERE m.listing_id = l.id AND l.id = ${request.params().id} AND m.username = '${request.params().username}'`)
        //const chat = await db.from('messages').where('username', user.username).where('listing_id', request.params().id)
        if (!chat) {
            return view.render('pages/base', { page: 'pages/errors/not_found' })
        }
        const anzeige = await db.from('listing').where('id', request.params().id).first()
        //console.log(chat)
        return view.render('pages/base', { page: 'pages/user/chat', chat, title: 'Chat', user, anzeige })
    }

    async processChatMessage({ request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        let message = request.input('message');
        console.log(message)
        console.log(message)
        const result = await db.table('messages').insert({ listing_id: request.params().id, username: request.params().username, content: request.input('message'), sendername: user.username })
        return response.redirect('back')
    }

}