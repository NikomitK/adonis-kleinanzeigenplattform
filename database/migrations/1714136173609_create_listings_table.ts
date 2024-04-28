import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'listings'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('username').references('username').inTable('users').notNullable()
            table.string('title').notNullable()
            table.string('description').notNullable()
            table.decimal('price').notNullable()
            table.boolean('negotiable').notNullable().defaultTo(false)
            table.boolean('shipping').notNullable().defaultTo(false)
            table.decimal('shipping_price').nullable()
            table.string('status').notNullable().defaultTo('active')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}