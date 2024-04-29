import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Saved extends BaseModel {
    @column({ isPrimary: true })
    declare username: string

    @column({ isPrimary: true })
    declare listing_id: number
}