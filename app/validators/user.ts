import User from '#models/user'
import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
    vine.object({
        username: vine.string().unique(async (_db, value, _field) => {
            const user = await User.findBy('username', value)
            return !user
        }),
        email: vine.string().normalizeEmail().unique(async (_db, value, _field) => {
            const user = await User.findBy('email', value)
            return !user
        }).email(),
        password: vine.string().minLength(8).maxLength(255).notSameAs('username').notSameAs('email').confirmed(),
    })
)

export const loginValidator = vine.compile(
    vine.object({
        username: vine.string(),
        password: vine.string()
    })
)

export const updateProfileValidator = vine.compile(
    vine.object({
        email: vine.string().unique(async (_db, value, _field) => {
            const user = await User.findBy('email', value)
            return !user
        }).email().optional(),
        firstname: vine.string().alpha().optional(),
        lastname: vine.string().alpha().optional(),
        number: vine.string().optional(),
    })
)