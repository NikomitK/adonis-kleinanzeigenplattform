import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app';
import { Exception } from '@adonisjs/core/exceptions';
import User from '#models/user';
import Saved from '#models/saved';
import { loginValidator, registerValidator, updateProfileValidator } from '#validators/user';

export default class UsersController {

    async registerForm({ view }: HttpContext) {
        return view.render('layouts/login', { page: 'pages/user/register', title: 'Registrieren' })
    }

    async registerProcess({ request, response, session, auth }: HttpContext) {
        const { username, email, password } = await request.validateUsing(registerValidator)

        const user = new User()
        user.username = username
        user.firstname = null
        user.lastname = null
        user.email = email
        user.password = password
        user.save()
        await auth.use('web').login(user)

        response.redirect(session.get('intended') ?? '/konto')
    }

    async loginForm({ view, request }: HttpContext) {
        return view.render('layouts/login', { page: 'pages/user/login', title: 'Login', url: request.url() })
    }

    async loginProcess({ request, response, auth, session }: HttpContext) {
        const { username, password } = await request.validateUsing(loginValidator)

        const user = await User.verifyCredentials(username, password)
        await auth.use('web').login(user)

        return response.redirect().toPath(session.get('intended') ?? '/konto')
    }

    async logout({ response, auth }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect('/')
    }

    async coffee() {
        throw new Exception("I'm a teapot", { status: 418 })
    }

    async konto({ view, auth }: HttpContext) {
        const user = auth.user!

        const achieved = await db.from('achievments').whereIn('title', db.from('achieveds').where('username', user.username).select('title'))

        const unAchieved = await db.from('achievments').whereNotIn('title', db.from('achieveds').where('username', user.username).select('title'))

        return view.render('layouts/user', { page: 'pages/user/konto', user, achieved, unAchieved, title: 'Konto' })
    }

    async updateProfile({ request, response, auth }: HttpContext) {
        const user = auth.user!

        // die profilbilder werden, anders als bei den anzeigen, extra nicht als webp umgewandelt, dass man gifs benutzen kann.
        let picture = request.file('image', { size: '3mb', extnames: ['jpg', 'png', 'jpeg', 'webp', 'gif'] })

        if (!picture?.isValid) {
            picture = null;
        } else {
            await picture.move(app.publicPath('/profile'), {
                name: `${user.username}.${picture.extname}`,
                overwrite: true
            })
        }

        const { email, firstname, lastname, number } = await request.validateUsing(updateProfileValidator)

        user.firstname = firstname ?? user.firstname;
        user.lastname = lastname ?? user.lastname;
        user.email = email ?? user.email;
        user.number = number ?? user.number;
        user.picture = picture?.fileName ?? user.picture;

        await user.save();

        return response.redirect('/konto');
    }

    async saveListing({ request, auth }: HttpContext) {
        //kein await, weil wieso auch? 
        new Saved().fill({ username: auth.user!.username, listing_id: parseInt(request.params().id) }).save()
    }

    async unsaveListing({ request, auth }: HttpContext) {
        Saved.findBy({ username: auth.user!.username, listing_id: request.params().id }).then((saved) => { saved?.delete() })
    }

}