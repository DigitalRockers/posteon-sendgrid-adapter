var	_ = require('lodash');
var sendgrid  = require('sendgrid');

var baseOptions = {

};

var fieldMapping = {
  subject: 'subject',
  html: 'html',
  text: 'text',
  metadata: 'unique_args',
  tags: 'category',
};

/*
  smtpapi:  new sendgrid.smtpapi(),
  to:       [],
  toname:   [],
  from:     '',
  fromname: '',
  subject:  '',
  text:     '',
  html:     '',
  bcc:      [],
  cc:       [],
  replyto:  '',
  date:     '',
  files: [
   {
     filename:     '',           // required only if file.content is used.
     contentType:  '',           // optional
     cid:          '',           // optional, used to specify cid for inline content
     path:         '',           //
     url:          '',           // == One of these three options is required
     content:      ('' | Buffer) //
   }
  ],
  file_data:  {},
  headers:    {},
  sub,
  section,
  - category,
  - unique_args,
  filters: {
    bcc: {enable: 0|1, email},
    bypass_list_management: {enable: 0|1},
    clicktrack: {enable: 0|1},
    dkim: {domain, use_from},
    footer: {enable: 0|1, "text/html", "text/plain"},
    ganalytics: {"enable" : 1, "utm_source", "utm_medium", "utm_content", "utm_campaign"},
    gravatar: {enable: 0|1},
    opentrack: {enable: 0|1, replace},
    spamcheck: {enable: 0|1, maxscore: 0-10.0, url},
    subscriptiontrack: {enable: 0|1, "text/html", "text/plain", replace},
    templates: {enable: 0|1, template_id},
    template: {enable: 0|1, "text/html"}
  },
  send_at,
*/

var getRecipientString = function (recipient) {
  return recipient.name ? recipient.name + ' <' + recipient.email + '>' : recipient.email;
};

var optionsBuilder = function (options) {
  var mapped = {};

  var mapped = {};
  for (var i in options) {
      if (fieldMapping[i]) {
        mapped[fieldMapping[i]] = options[i];
      }
  }
  mapped.from = options.from.email;
  if(options.from.name)
    mapped.fromname = options.from.name;

  if(options.replyTo)
    mapped.replyto = options.replyTo;

  if(options.sendAt)
    mapped.date = options.sendAt;

  if(options.attachments) {
    mapped.files = _.map(options.attachments, function (attachment) {
        return {
          filename: attachment.name,
          content: attachment.content,
          contentType: attachment.type,
          path: attachment.path
          //cid
          //url
        };
    });
  }

  /*if(options.bcc)
    mapped.bcc = _.map(options.bcc, getRecipientString);
  if(options.cc)
    mapped.cc = _.map(options.cc, getRecipientString);*/
  return mapped;
};



exports.send = function(credential, options, callback){
  var sendgridClient = sendgrid(credential.apiKey);
  var sendgridConfig = _.extend(baseOptions, optionsBuilder(options));

  var handleResponse = function (err, responses) {
    if(err) return callback(err);

    switch (responses.message) {
      case 'success':
        callback(null, {status: 'success'});
      break;
      default:
        callback(responses);
    };
  };

  var email = new sendgridClient.Email(sendgridConfig);
  for(var i = 0; i < options.to.length; i++) {
    email.addSmtpapiTo(getRecipientString(options.to[i]));
  }
  sendgridClient.send(email, handleResponse);
};

exports.name = 'sendgrid';
