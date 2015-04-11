
Router.configure({
    layoutTemplate:'main'
});

Router.map(function(){

    this.route('notes',{path:'/'});

    this.route('group',{path:'/group'});


    this.route('contactUs', {path:'/contactUs'});

    this.route('aboutUs', {path:'/aboutUs'});

    this.route('help', {path:'/help'});

    this.route('tagList', {path:'/tagList'});

});