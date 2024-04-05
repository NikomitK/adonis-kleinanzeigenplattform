import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash';

export default class UsersController {
    async loginForm({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (user) {
            return response.redirect('back')
        }
        return view.render('pages/base', { page: 'pages/user/login' })
    }

    async loginProcess({ view, request, response, session }: HttpContext) {
        if (session.get('user')) {
            return response.redirect('back')
        }
        const result = await db.from('user').where('username', request.input('username')).first();
        if (!result) {
            console.log('User not found');
            return view.render('pages/user/login', { error: 'Invalid username or password' });
        }
        const passwordOk = await hash.verify(result.password, request.input('password'))
        if (!passwordOk) {
            return view.render('pages/user/login', { error: 'Invalid username or password' });
        }
        session.put('user', { username: result.username, firstname: result.firstname, lastname: result.lastname, email: result.email, since: result.since, picture: result.picture})
        console.log('User logged in')
        return response.redirect('/');
    }

    async registerForm({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (user) {
            return response.redirect('back')
        }
        return view.render('pages/base', { page: 'pages/user/register' })
    }

    async registerProcess({ view, request, response, session }: HttpContext) {
        if (session.get('user')) {
            return response.redirect('back')
        }
        const hashedPassword = await hash.make(request.input('password'));
        const now = new Date();
        try {
            const result = await db.table('user').insert({ username: request.input('username'), password: hashedPassword, firstname: request.input('firstname'), lastname: request.input('lastname'), since: now, email: request.input('email') })
            response.redirect('/');
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async konto({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        console.log(user)
        return view.render('pages/base', { page: 'pages/user/konto', konto: user })
    }

    async saveListing({ request }: HttpContext) {
        const result = await db.table('saved').insert({ username: 'nikomitk', listing_id: request.params().id })
        //TODO check for errors
    }
}