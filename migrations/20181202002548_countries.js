
exports.up = function(knex, Promise) {
  return knex('countries').insert([
    { name: 'Hungury', short: 'hu' },
    { name: 'Poland', short: 'pl' },
  ]);
};

exports.down = function(knex, Promise) {
  
};
