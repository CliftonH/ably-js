"use strict";

define(['ably', 'shared_helper'], function(Ably, helper) {
	var exports = {};

	exports.setupInit = function(test) {
		test.expect(1);
		helper.setupApp(function(err) {
			if(err) {
				test.ok(false, helper.displayError(err));
			} else {
				test.ok(true, 'app set up');
			}
			test.done();
		});
	};

	/* init with key string */
	exports.init_key_string = function(test) {
		test.expect(1);
		try {
			var keyStr = helper.getTestApp().keys[0].keyStr,
				rest = new helper.Ably.Rest(keyStr);

			test.equal(rest.options.key, keyStr);
			test.done();
		} catch(e) {
			test.ok(false, 'Init with key failed with exception: ' + e.stack);
			test.done();
		}
	};

	/* init with token string */
	exports.init_token_string = function(test) {
		test.expect(1);
		try {
			/* first generate a token ... */
			var rest = helper.AblyRest();
			var testKeyOpts = {key: helper.getTestApp().keys[1].keyStr};

			rest.auth.requestToken(null, testKeyOpts, function(err, tokenDetails) {
				if(err) {
					test.ok(false, helper.displayError(err));
					test.done();
					return;
				}

				var tokenStr = tokenDetails.token,
					rest = new helper.Ably.Rest(tokenStr);

				test.equal(rest.options.token, tokenStr);
				test.done();
			});
		} catch(e) {
			test.ok(false, 'Init with token failed with exception: ' + e.stack);
			test.done();
		}
	};

	/* init with tls: false */
	exports.init_tls_false = function(test) {
		test.expect(1);
		var rest = helper.AblyRest({tls: false, port: 123, tlsPort: 456});
		test.equal(rest.baseUri("example.com"), "http://example.com:123")
		test.done();
	};

	/* init with tls: true */
	exports.init_tls_true= function(test) {
		test.expect(1);
		var rest = helper.AblyRest({tls: true, port: 123, tlsPort: 456});
		test.equal(rest.baseUri("example.com"), "https://example.com:456")
		test.done();
	};

	/* init without any tls key should enable tls */
	exports.init_tls_absent = function(test) {
		test.expect(1);
		var rest = helper.AblyRest({port: 123, tlsPort: 456});
		test.equal(rest.baseUri("example.com"), "https://example.com:456")
		test.done();
	};

	return module.exports = helper.withTimeout(exports);
});
