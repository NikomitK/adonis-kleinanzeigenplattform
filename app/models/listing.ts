import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Listing extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare username: string

    @column()
    declare title: string

    @column()
    declare description: string

    @column()
    declare price: string

    @column()
    declare negotiable: boolean

    @column()
    declare shipping: boolean

    @column()
    declare shipping_price: string

    @column()
    declare status: string
}