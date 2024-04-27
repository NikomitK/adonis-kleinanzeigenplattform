import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('message_id').primary()
        table.integer('listing_id').references('id').inTable('listings').notNullable()
        table.string('username').references('username').inTable('users').notNullable()
        table.text('content').notNullable()
        table.string('sendername').references('username').inTable('users').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}