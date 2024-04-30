import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash';
import app from '@adonisjs/core/services/app';
import { Exception } from '@adonisjs/core/exceptions';
import User from '#models/user';
import Saved from '#models/saved';
import { registerValidator, updateProfileValidator } from '#validators/user';

export default class UsersController {

    async registerForm({ view, response, session }: HttpContext) {
        const user = session.get('user')

        if (user) {
            return response.redirect('back')
        }

        return view.render('layouts/login', { page: 'pages/user/register', title: 'Registrieren' })
    }

    async registerProcess({ request, response, session }: HttpContext) {
        if (session.get('user')) {
            return response.redirect('back')
        }

        const { username, firstname, lastname, email, password } = await registerValidator.validate(request.all())

        const tmpUser = new User()
        tmpUser.username = username
        tmpUser.firstname = firstname ?? null
        tmpUser.lastname = lastname ?? null
        tmpUser.email = email
        tmpUser.password = password
        tmpUser.save()

        session.put('user', { username: tmpUser.username, firstname: tmpUser.firstname, lastname: tmpUser.lastname, email: tmpUser.email, number: tmpUser.number, since: tmpUser.since, picture: tmpUser.picture })
        response.redirect('/konto')
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

        const user = await User.find(request.input('username'))

        if (!user) {
            console.log('User not found');
            return view.render('layouts/login', { page: 'pages/user/login', error: 'Invalid username or password' });
        }

        const passwordOk = await hash.verify(user.password, request.input('password'))

        if (!passwordOk) {
            return view.render('layouts/login', { page: 'pages/user/login', error: 'Invalid username or password' });
        }

        session.put('user', { username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email, number: user.number, since: user.since, picture: user.picture })

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

        const achieved = await db.from('achievments').whereIn('title', db.from('achieveds').where('username', user.username).select('title'))
        
        const unAchieved = await db.from('achievments').whereNotIn('title', db.from('achieveds').where('username', user.username).select('title'))
        
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

        const {email, firstname, lastname, number} = await request.validateUsing(updateProfileValidator)

        const updatedUser = await User.find(user.username)

        if(!updatedUser){
            throw new Exception('User not found', { status: 404 })
        }


        updatedUser.firstname = firstname ?? updatedUser.firstname;
        updatedUser.lastname = lastname ?? updatedUser.lastname;
        updatedUser.email = email ?? updatedUser.email;
        updatedUser.number = number ?? updatedUser.number;
        updatedUser.picture = picture?.fileName ?? updatedUser.picture;

        await updatedUser.save();

        session.put('user', { username: updatedUser.username, firstname: updatedUser.firstname, lastname: updatedUser.lastname, email: updatedUser.email, number: updatedUser.number, since: updatedUser.since, picture: updatedUser.picture });
        
        return response.redirect('/konto');
    }

    async saveListing({ request, session }: HttpContext) {
        const user = session.get('user')

        if (!user) {
            return
        }

        new Saved().fill({ username: user.username, listing_id: parseInt(request.params().id)}).save()
        //TODO check for errors
    }

    async unsaveListing({ request, session }: HttpContext) {
        const user = session.get('user')

        if (!user) {
            return
        }
        
        await Saved.findBy({username: user.username, listing_id: request.params().id}).then((saved) => {saved?.delete()})        
        //TODO check for errors
    }

}