import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Achieved extends BaseModel {
    @column({ isPrimary: true })
    declare username: string

    @column({ isPrimary: true })
    declare title: string
}