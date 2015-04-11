Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'first-name',
        fieldLabel: 'First name',
        inputType: 'text',
        visible: true,
        saveToProfile: true
    }, {
        fieldName: 'last-name',
        fieldLabel: 'Last name',
        inputType: 'text',
        visible: true,
        saveToProfile: true
    },
        /*{
         fieldName: 'terms',
         fieldLabel: 'I accept the terms and conditions',
         inputType: 'checkbox',
         visible: true,
         saveToProfile: false
         }*/]
});

accountsUIBootstrap3.logoutCallback = function(error) {


    //Router.route('home', {name: 'home'});

    Session.set('noteMode','addNote');
    Session.set('noteId', '');


}