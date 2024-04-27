import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
    @column({ isPrimary: true })
    declare username: string

    @column()
    declare firstname: string | null

    @column()
    declare lastname: string | null

    @column()
    declare email: string

    @column()
    declare since: string

    @column()
    declare password: string

    @column()
    declare picture: string

    @column()
    declare number: string | null
}