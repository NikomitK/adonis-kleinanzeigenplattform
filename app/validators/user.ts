import User from '#models/user'
import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
    vine.object({
        email: vine.string().email().unique(async (value) => {
            const user = User.findBy('email', value)
            return !user
        }).optional(),
        firstname: vine.string().alpha().optional(),
        lastname: vine.string().alpha().optional(),
        number: vine.string().optional(),
    })
)