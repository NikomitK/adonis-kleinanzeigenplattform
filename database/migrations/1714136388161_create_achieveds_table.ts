import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'achieveds'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.string('username').references('username').inTable('users').notNullable().onDelete('CASCADE')
            table.string('title').references('title').inTable('achievments').notNullable().onDelete('CASCADE')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}