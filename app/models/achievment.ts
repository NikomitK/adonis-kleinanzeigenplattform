import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Achievment extends BaseModel {
    @column({ isPrimary: true })
    declare title: string

    @column()
    declare description: string

    @column()
    declare icon: string
}