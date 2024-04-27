import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'images'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('listing_id').references('id').inTable('listings').notNullable().onDelete('CASCADE')
            table.string('path').notNullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}