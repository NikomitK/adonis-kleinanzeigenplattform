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
        session.put('user', { username: result.username, firstname: result.firstname, lastname: result.lastname, email: result.email, number: result.number, since: result.since, picture: result.picture })
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

    async logout({ response, session }: HttpContext) {
        session.clear()
        return response.redirect('/')
    }

    async konto({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const unAchieved = await db.rawQuery('SELECT * FROM achievment WHERE title NOT IN (SELECT title FROM achieved WHERE username = ?)', [user.username])
        const achieved = await db.rawQuery('SELECT * FROM achievment WHERE title IN (SELECT title FROM achieved WHERE username = ?)', [user.username])
        return view.render('pages/base', { page: 'pages/user/konto', user, achieved, unAchieved })
    }

    async updateProfile({ request, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const result = await db.from('user').where('username', user.username).update({ 
            firstname: request.input('firstname') ? request.input('firstname') : user.firstname, 
            lastname: request.input('lastname') ? request.input('lastname') : user.lastname, 
            email: request.input('email') ? request.input('email') : user.email, 
            number: request.input('number') ? request.input('number') : user.number})
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
}