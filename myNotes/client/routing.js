
Router.configure({
    layoutTemplate:'main'
});

Router.map(function(){

    this.route('notes',{path:'/'});

    this.route('groups',{path:'/groups'});


    this.route('contactUs', {path:'/contactUs'});

    this.route('ourTeam', {path:'/ourTeam'});

    this.route('help', {path:'/help'});

    this.route('tagList', {path:'/tagList'});

    this.route('trash', {path:'/trash'});

});

<<<<<<< HEAD
Router.onBeforeAction(function() {
    GoogleMaps.load();
    this.next();
}, { only: ['contactUs'] });
=======
>>>>>>> origin/master
