'use strict';

const { Model } = require('objection');
const Checkpoint = require('./Checkpoint');

class Country extends Model {
    static get tableName() {
        return 'countries';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            retuired: ['name', 'short'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1, maxLength: 255 },
                short: { type: 'string', minLength: 2, maxLength: 3 }
            }
        };
    }

    static get relationMappings() {
        return {
            checkpoints: {
                relation: Model.HasManyRelation,
                modelClass: Checkpoint,
                join: {
                    from: 'countries.id',
                    to: 'checkpoints.countryId'
                }
            }
        };
    }
}

module.exports = Country;
