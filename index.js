'use strict';
var debug = require('debug')('session');

module.exports = function (connect) {

	var Store = (connect.session) ? connect.session.Store : connect.Store;

	function RethinkStore(options) {
		var self = this;
		if (options === null || options === undefined) {
			self.r = require('rethinkdbdash')();
		} else if (typeof options === 'function') {
			self.r = options;
		} else if (typeof options === 'object') {
			self.r = require('rethinkdbdash')(options);
		} else {
			throw new TypeError('Invalid options');
		}

		options.table = options.table || 'session';
		options.browserSessionsMaxAge = options.browserSessionsMaxAge || 86400000; // 1 day
		self.options = options || {};

		Store.call(self, options); // Inherit from Store

		self.r.tableCreate(self.options.table)
		.catch(function (error) {
			if (!error.message.indexOf('already exists') > 0) {
				throw error;
			}
		})
		.then(function () {
			self.r.table(self.options.table)
			.indexStatus('expires')
			.catch(function (err) {
				debug('INDEX STATUS %j', err);
				return self.r.table(self.options.table).indexCreate('expires').run();
			})
			.then(function (result) {
				debug('PRIOR STEP %j', result);
				self.emit('connect');
			});
		})

		self.clearInterval = setInterval(function () {
			var now = Date.now();
			self.r.table(self.options.table)
			.between(0, now, {index: 'expires'})
			.delete()
			.run()
			.tap(function (result) {
				debug('DELETED EXPIRED %j', result);
			});
		}, options.clearInterval || 60000).unref();
	}

	RethinkStore.prototype = new Store();

	RethinkStore.prototype.get = function (sid, fn) {
		var self = this;

		debug('GETTING "%s" ...', sid);
		return self.r.table(self.options.table)
		.get(sid)
		.then(function (data) {
			debug('GOT %j', data);
			return data.session;
		}).asCallback(fn);
	};

	RethinkStore.prototype.set = function (sid, sess, fn) {
		var self = this;

		var sessionToStore = {
			id: sid,
			expires: new Date(Date.now() + (sess.cookie.originalMaxAge || this.browserSessionsMaxAge)),
			session: sess
		};
		debug('SETTING "%j" ...', sessionToStore);
		return self.r.table(self.options.table)
		.insert(sessionToStore, {
			conflict: 'update'
		})
		.then(function (data) {
			debug('SET %j', data);
		})
		.asCallback(fn);
	};

	RethinkStore.prototype.destroy = function (sid, fn) {
		var self = this;

		debug('DELETING "%s" ...', sid);
		return r.table(self.options.table)
		.get(sid)
		.delete()
		.run()
		.tap(function (data) {
			debug('DELETED %j', data);
		})
		.asCallback(fn);
	};

	return RethinkStore;
};
