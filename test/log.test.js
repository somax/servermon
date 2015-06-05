var log = require('../lib/log');



describe('log', function() {
	describe('log\'s color ', function() {
		it('should be white', function() {
			log('log message!');
		})
	})
	describe('log.debug\'s color', function() {
		it('should be cyan', function() {
			log.debug('debug message!');
		})
	})
	describe('log.warn\'s color', function() {
		it('should be red', function() {
			log.warn('warning message!');

		})
	})
	describe('log.error\'s color', function() {
		it('should be yellow', function() {
			log.err('error message!');
		})
	})
	describe('log.info\'s color', function() {
		it('should be green', function() {
			log.info('info message!');
		})
	})
})