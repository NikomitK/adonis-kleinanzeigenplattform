import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Image extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare listing_id: number

    @column()
    declare path: string
}