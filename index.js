const path = require('path')
const async = require('async')
const newman = require('newman')

const PARALLEL_RUN_COUNT = process.argv[2]

let commands = []
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
	const parametersForTestRun = {
		collection: path.join(__dirname, process.argv[4]), // your collection
		environment: path.join(__dirname, process.argv[5]), // your environment
		iterationCount: parseInt(process.argv[3]),
		reporters: ['cli', 'json'],
		reporter: {json: { export: './logs/runs.' + PARALLEL_RUN_COUNT + 
									'.iterations.' + parseInt(process.argv[3]) + 
									'.thread.' + index + '.log'}}
	};
	
	parallelCollectionRun = function (done) {
		newman.run(parametersForTestRun, done);
	};

    commands.push(parallelCollectionRun);
}

// Runs the Postman sample collection thrice, in parallel.
async.parallel(
    commands,
    (err, results) => {
        err && console.error(err);

        results.forEach(function (result) {
            var failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                `${result.collection.name} ran successfully.`);
        });
    });
