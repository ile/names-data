"use strict";

var liveDbMongo = require('k-livedb-mongo'),
	kmodel = require('k-model'),
	mongoUrl = process.env.MONGO_URL || process.env.MONGOHQ_URL || (process.env.MONGO_PORT && process.env.MONGO_PORT.replace('tcp://', 'mongodb://') + '/babynames') || 'mongodb://localhost:27017/babynames',
	store;

store = kmodel.createStore({
	db: liveDbMongo(mongoUrl, { safe: true })
});

module.exports = store.createModel();

