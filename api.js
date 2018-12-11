'use strict';

const { transaction } = require('objection');
const CountryModel = require('./models/Country');
const CheckpointModel = require('./models/Checkpoint');
const RecordModel = require('./models/Record');

module.exports = router => {
  router.get('/coutries', async (req, res) => {
    const countries = await CountryModel.query();
    res.send(countries);
  });

  router.get('/countries/:id/checkpoints', async (req, res) => {
    const checkpoints = await CheckpointModel.query()
      .where('countryId', req.params.id);
    res.send(checkpoints);
  });

  router.get('/countries/:countryId/checkpoints/:checkpointId/records/from/:from/to/:to/:dir', async (req, res) => {
    const checkpointId = req.params.checkpointId;
    const from = new Date(req.params.from);
    const to = new Date(req.params.to);
    from.setHours(from.getHours()+2);
    to.setHours(to.getHours()+2);
    const records = await RecordModel.query()
      .where('checkpointId', checkpointId);
    res.send(checkpoints);
  });

  // Add a child for a Person.
  router.post('/persons/:id/children', async (req, res) => {
    const person = await Person.query().findById(req.params.id);

    if (!person) {
      throw createStatusCodeError(404);
    }

    const child = await person.$relatedQuery('children').insert(req.body);

    res.send(child);
  });

  // Add a pet for a Person.
  router.post('/persons/:id/pets', async (req, res) => {
    const person = await Person.query().findById(req.params.id);

    if (!person) {
      throw createStatusCodeError(404);
    }

    const pet = await person.$relatedQuery('pets').insert(req.body);

    res.send(pet);
  });

  // Get a Person's pets. The result can be filtered using query parameters
  // `name` and `species`.
  router.get('/persons/:id/pets', async (req, res) => {
    const person = await Person.query().findById(req.params.id);

    if (!person) {
      throw createStatusCodeError(404);
    }

    // We don't need to check for the existence of the query parameters because
    // we call the `skipUndefined` method. It causes the query builder methods
    // to do nothing if one of the values is undefined.
    const pets = await person
      .$relatedQuery('pets')
      .skipUndefined()
      .where('name', 'like', req.query.name)
      .where('species', req.query.species);

    res.send(pets);
  });

  // Add a movie for a Person.
  router.post('/persons/:id/movies', async (req, res) => {
    // Inserting a movie for a person creates two queries: the movie insert query
    // and the join table row insert query. It is wise to use a transaction here.
    const movie = await transaction(Person.knex(), async trx => {
      const person = await Person.query(trx).findById(req.params.id);

      if (!person) {
        throw createStatusCodeError(404);
      }

      return await person.$relatedQuery('movies', trx).insert(req.body);
    });

    res.send(movie);
  });

  // Add existing Person as an actor to a movie.
  router.post('/movies/:id/actors', async (req, res) => {
    const movie = await Movie.query().findById(req.params.id);

    if (!movie) {
      throw createStatusCodeError(404);
    }

    await movie.$relatedQuery('actors').relate(req.body.id);

    res.send(req.body);
  });

  // Get Movie's actors.
  router.get('/movies/:id/actors', async (req, res) => {
    const movie = await Movie.query().findById(req.params.id);

    if (!movie) {
      throw createStatusCodeError(404);
    }

    const actors = await movie.$relatedQuery('actors');
    res.send(actors);
  });
};

// The error returned by this function is handled in the error handler middleware in app.js.
function createStatusCodeError(statusCode) {
  return Object.assign(new Error(), {
    statusCode
  });
}
