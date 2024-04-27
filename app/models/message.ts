import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Message extends BaseModel {
    @column({ isPrimary: true })
    declare message_id: number

    @column()
    declare listing_id: number

    @column()
    declare username: string

    @column()
    declare content: string

    @column()
    declare sendername: string
}