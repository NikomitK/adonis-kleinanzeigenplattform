import User from '#models/user'
import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
    vine.object({
        username: vine.string().unique(async (_, value, field) => {
            const user = await User.findBy('username', value)
            if (user) field.report('Der Nutzername ist test bereits vergeben.', 'username', field)
            return !user
        }),
        email: vine.string().email().unique(async (_, value, field) => {
            const user = await User.findBy('email', value)
            if (user) field.report('Die E-Mail-Adresse ist bereits vergeben.', 'email', field)
            return !user
        }),
        password: vine.string().minLength(8).notSameAs('username').notSameAs('email').notSameAs('firstname').notSameAs('lastname').notSameAs('number').confirmed(),
        firstname: vine.string().alpha().optional(),
        lastname: vine.string().alpha().optional(),
        number: vine.string().optional(),
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
        email: vine.string().email().unique(async (_, value, field) => {
            const user = await User.findBy('email', value)
            if (user) field.report('Die E-Mail-Adresse ist bereits vergeben.', 'email', field)
            return !user
        }).optional(),
        firstname: vine.string().alpha().optional(),
        lastname: vine.string().alpha().optional(),
        number: vine.string().optional(),
    })
)


