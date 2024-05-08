import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'listings'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('username').references('username').inTable('users').notNullable()
            table.string('title').notNullable()
            table.text('description').notNullable()
            table.string('price').notNullable()
            table.boolean('negotiable').notNullable().defaultTo(false)
            table.boolean('shipping').notNullable().defaultTo(false)
            table.string('shipping_price').notNullable().defaultTo('0.00')
            table.string('status').notNullable().defaultTo('active')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}