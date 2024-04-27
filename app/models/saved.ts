import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Saved extends BaseModel {
    @column()
    declare username: string

    @column()
    declare listing_id: number
}