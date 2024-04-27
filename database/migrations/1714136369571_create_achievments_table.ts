import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'achievments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
        table.string('title').primary()
        table.text('description').notNullable()
        table.string('icon').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}