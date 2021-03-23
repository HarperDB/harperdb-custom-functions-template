'use strict';

const _ = require('lodash');

module.exports = (result) => _.map(result, _.partialRight(_.pick, ['dog_name', 'owner_name']));
