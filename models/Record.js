'use strict';

const { Model } = require('objection');

class Record extends Model {
    static get tableName() {
        return 'records';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['checkpointId', 'direction','datetime', 'delay'],
            properties: {
                id: { type: 'integer' },
                checkpointId: { type: 'integer' },
                direction: { type: 'string', minLength: 1, maxlength: 1 },
                datetime: { type: 'datetime' },
                delay: { type: 'time' }
            }
        };
    }
}

module.exports = Record;
