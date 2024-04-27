import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'saveds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
        table.string('username').references('username').inTable('users').notNullable().onDelete('CASCADE')
        table.integer('listing_id').references('id').inTable('listings').notNullable().onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}