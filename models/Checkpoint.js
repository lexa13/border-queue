'use strict';

const { Model } = require('objection');

class Checkpoint extends Model {
    static get tableName() {
        return 'checkpoints';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'countryId'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1, maxLength: 255 },
                countryId: { type: 'integer' }
            }
        }
    }

    static get relationMApping() {
        return {
            country: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Country',
                join: {
                    from: 'checkpoints.countryId',
                    to: 'countries.id'
                }
            }
        }
    }
}

module.exports = Checkpoint;
