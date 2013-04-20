/*
 * Base init case
 */
var _init = {};
var init = this.init = {};

init.initbase0 = function(test) {
	test.expect(1);
	try {
		var timeout,
				ably = new Ably.Realtime({
					log: {level: 4},
					restHost:testVars.realtimeHost,
					wsHost:testVars.realtimeHost,
					port:testVars.realtimePort,
					tlsPort:testVars.realtimeTlsPort,
					key: testVars.key0Str
				});
		ably.connection.on('connected', function() {
			clearTimeout(timeout);
			test.ok(true, 'Verify init with key');
			test.done();
			ably.close();
		});
		['failed', 'suspended'].forEach(function(state) {
			ably.connection.on(state, function() {
				clearTimeout(timeout);
				test.ok(false, 'Connection to server failed');
				test.done();
			});
		});
		timeout = setTimeout(function() {
      test.ok(false, 'Timed out: Trying to connect took longer than expected');
      test.done();
    }, 10 * 1000);
	} catch(e) {
		test.ok(false, 'Init with key failed with exception: ' + e.stack);
		test.done();
	}
};
