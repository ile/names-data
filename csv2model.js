#!/usr/bin/env node
var program = require('commander'),
	csv = require('csv'),
	d = '',
	model = require('./model');

program
	.version('0.0.1')
	.option('-y, --year [year]', 'Year')
	.option('-g, --gender [gender]', 'm or f')
	.parse(process.argv);
 
console.log(program.year, program.gender)

if (program.year && program.gender) {

	process.stdin.resume();  

	process.stdin.on('data', function(data) {  
		d = d + data.toString();
	});

	process.stdin.on('end', function() {  
		csv.parse(d, function(err, data){
			var added = 0;

			function sett() {
				process.nextTick(set);
			}

			function set() {
				var l = data.pop();
				if (l && l[1] && l[2]  && l[3] && l[1].match(/\d+/)) {
					// console.log(l);
					var name = l[2].trim().toLowerCase(),
						count = parseInt(l[3].replace(/\s+/, '').replace(',', ''), 10);

					// console.log(name, count);

					if (name.indexOf('.') !== -1) {
						console.error('name contains a dot! skipping', program.year, name, count);
						process.nextTick(set);
					}
					else {
						var q = model.at("people." + name);
						q.subscribe(function (err) {

							// console.log(name, count);
							added++;

							if (q.get(program.gender)) {
								q.set(program.gender + '.' + program.year, count, set)
							}
							else if (q.get()) {
								q.setNull(program.gender, {}, function() {
									q.set(program.gender + '.' + program.year, count, set)
								});
							}
							else {
								var obj2 = {},
									obj = {
										id: name
									};

								obj2[program.year] = count;
								obj[program.gender] = obj2;
								model.add('people', obj, set);
							}
						});
					}
				}
				else if (l) {
					process.nextTick(set);
				}
				else {
					console.log('added', added);
					process.exit();
				}
			}

			set();
		});
	});
}
else {
	program.help();
}