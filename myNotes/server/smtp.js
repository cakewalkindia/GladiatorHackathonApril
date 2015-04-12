Meteor.startup(function () {
    smtp = {
        username: 'soheb@cakewalk.in',   // eg: server@gentlenode.com
        password: 'london143',   // eg: 3eeP1gtizk5eziohfervU
        server:   'smtp.gmail.com',  // eg: mail.gandi.net
        port: 587
    }

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});

////Meteor.startup(function () {
//    process.env.MAIL_URL = 'rapatisoheb%40gmail.com:786@Soheb@smtp.gmail.com:465';
////});
//
Meteor.methods({
    'sendEmail': function (to, from, subject, text) {
        check([to, from, subject, text], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        //this.unblock();

        Email.send({
            to: to,
            from: from,
            subject: subject,
            text: text
        });
    }
});