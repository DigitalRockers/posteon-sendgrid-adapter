var should = require('should');

var sendgrid = require('./index');

var apiKey = process.env.sendgridApiKey;


describe('Sendgrid adapter test', function() {
	this.timeout(10000);

	it('Send test', function(done) {
		sendgrid.send(
			{
	      apiKey: apiKey,
			},
			{
	      to: [{name: 'Gianluca', email: 'gianluca.pengo@gmail.com'}],
	      from: {name: 'Kademy', email: 'noreply@digitalrockers.it'},
	      subject: 'Test Sendgrid adapter',
	      html: '<h1>Test Sendgrid adapter</h1><p>Test body</p>',
	      //text: 'text',
	    	//attachments: 'attachments',
				/*attachments: [{
					name: 'test.pdf',
					path: __dirname + '/test.pdf',
					//content: require('fs').readFileSync(__dirname + '/test.pdf'),
					type: 'application/pdf',
				}],*/
	      //images: 'images',
	    	//tags: 'tags',
	      //headers: 'headers',
	      //metadata: 'metadata',
			}, function(err, res){
				should.not.exist(err);

	      res.should.be.instanceof(Object);
	      res.should.have.property('status');

				done();
			});
	});
});
