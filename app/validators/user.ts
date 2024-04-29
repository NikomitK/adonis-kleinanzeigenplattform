import User from '#models/user'
import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
    vine.object({
        username: vine.string().unique(async (value) => {
            const user = await User.findBy('username', value)
            return !user
        }),
        email: vine.string().email().unique(async (value) => {
            const user = await User.findBy('email', value)
            return !user
        }),
        password: vine.string().minLength(8).notSameAs('username').notSameAs('email').notSameAs('firstname').notSameAs('lastname').notSameAs('number').sameAs('password-repeat'),
        firstname: vine.string().alpha().optional(),
        lastname: vine.string().alpha().optional(),
        number: vine.string().optional(),
    })
)

export const updateProfileValidator = vine.compile(
    vine.object({
        email: vine.string().email().unique(async (value) => {
            const user = await User.findBy('email', value)
            return !user
        }).optional(),
        firstname: vine.string().alpha().optional(),
        lastname: vine.string().alpha().optional(),
        number: vine.string().optional(),
    })
)
