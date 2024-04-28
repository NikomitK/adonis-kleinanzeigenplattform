import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash';
import app from '@adonisjs/core/services/app';
import { Exception } from '@adonisjs/core/exceptions';

export default class UsersController {

    async registerForm({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (user) {
            return response.redirect('back')
        }
        return view.render('layouts/login', { page: 'pages/user/register', title: 'Registrieren' })
    }

    async registerProcess({ view, request, response, session }: HttpContext) {
        if (session.get('user')) {
            return response.redirect('back')
        }
        const username = request.input('username')

        if (await db.from('users').where('username', username).first()) {
            return view.render('layouts/login', { page: 'pages/user/register', title: 'Registrieren', usernameTaken: true })
        }

        const email = request.input('email')

        if (await db.from('users').where('email', email).first()) {
            return view.render('layouts/login', { page: 'pages/user/register', title: 'Registrieren', emailTaken: true })
        }

        const password = request.input('password')
        const passwordRepeat = request.input('password-repeat')

        if (password !== passwordRepeat) {
            return view.render('layouts/login', { page: 'pages/user/register', title: 'Registrieren', passwordMismatch: true })
        }

        const hashedPassword = await hash.make(request.input('password'));
        const now = new Date();
        try {
            await db.table('user')
                .insert({ username: request.input('username'), password: hashedPassword, firstname: request.input('firstname'), lastname: request.input('lastname'), since: now, email: request.input('email') })
            response.redirect('/login');
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async loginForm({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (user) {
            return response.redirect('back')
        }
        return view.render('layouts/login', { page: 'pages/user/login', title: 'Login' })
    }

    async loginProcess({ view, request, response, session }: HttpContext) {
        if (session.get('user')) {
            return response.redirect('/konto')
        }
        const result = await db.from('users').where('username', request.input('username')).first();
        if (!result) {
            console.log('User not found');
            return view.render('layouts/login', { page: 'pages/user/login', error: 'Invalid username or password' });
        }
        const passwordOk = await hash.verify(result.password, request.input('password'))
        if (!passwordOk) {
            return view.render('layouts/login', { page: 'pages/user/login', error: 'Invalid username or password' });
        }
        session.put('user', { username: result.username, firstname: result.firstname, lastname: result.lastname, email: result.email, number: result.number, since: result.since, picture: result.picture })
        console.log('User logged in')
        return response.redirect('/konto');
    }

    async logout({ response, session }: HttpContext) {
        session.clear()
        return response.redirect('/')
    }

    async coffee() {
        throw new Exception("I'm a teapot", { status: 418 })
    }

    async konto({ view, response, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return response.redirect('/login')
        }
        const unAchieved = await db.from('achievments').whereNotIn('title', db.from('achieveds').where('username', user.username).select('title'))
        const achieved = await db.from('achievments').whereIn('title', db.from('achieveds').where('username', user.username).select('title'))
        return view.render('layouts/user', { page: 'pages/user/konto', user, achieved, unAchieved, title: 'Konto' })
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

        const email = request.input('email')

        //TODO
        if (await db.from('users').where('email', email).first()) {
            response.redirect('back')
        }

        await db.from('users').where('username', user.username).update({
            firstname: request.input('firstname') ? request.input('firstname') : user.firstname,
            lastname: request.input('lastname') ? request.input('lastname') : user.lastname,
            email: request.input('email') ? request.input('email') : user.email,
            number: request.input('number') ? request.input('number') : user.number,
            picture: picture ? picture.fileName : user.picture
        })

        const updatedUser = await db.from('users').where('username', user.username).first()

        session.put('user', { username: updatedUser.username, firstname: updatedUser.firstname, lastname: updatedUser.lastname, email: updatedUser.email, number: updatedUser.number, since: updatedUser.since, picture: updatedUser.picture })
        return response.redirect('/konto')
    }

    async saveListing({ request, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return
        }
        await db.table('saveds').insert({ username: user.username, listing_id: request.params().id })
        //TODO check for errors
    }

    async unsaveListing({ request, session }: HttpContext) {
        const user = session.get('user')
        if (!user) {
            return
        }
        await db.from('saveds').where('username', user.username).where('listing_id', request.params().id).delete()
        //TODO check for errors
    }

}