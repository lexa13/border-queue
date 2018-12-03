
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('countries', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('short');
    })
    .createTable('checkpoints', table => {
      table.increments('id').primary();
      table.integer('countryId')
        .unsigned()
        .references('id')
        .inTable('countries')
        .onDelete('CASCADE');
      table.string('name');
    })
    .createTable('records', table => {
      table.increments('id').primary();
      table.integer('checkpointId')
        .unsigned()
        .references('id')
        .inTable('checkpoints')
        .onDelete('CASCADE');
      table.string('direction');
      table.timestamp('datetime');
      table.time('time');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('countries')
    .dropTableIfExists('checkpoints')
    .dropTableIfExists('records');
};
