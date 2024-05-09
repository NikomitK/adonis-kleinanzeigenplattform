import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'users'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.string('username').primary()
            table.string('firstname').nullable()
            table.string('lastname').nullable()
            table.string('email', 254).notNullable().unique()
            table.timestamp('since', { useTz: true })
            table.string('password').notNullable()
            table.string('picture').defaultTo('default.png')
            table.string('number').nullable()
            table.integer('listing_count').defaultTo(0)
            table.integer('message_count').defaultTo(0)
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}