import mysql from 'mysql';
import config from '../../config';

export = (function () {
	
	const pool = mysql.createPool(config.database);

	pool.query('SELECT 1 + 1 AS solution', function(err) {
		if (err) throw err;
		console.log('Pool connected!');
	});
	return pool;
})();