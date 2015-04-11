/**
 * Created by soheb on 11-Apr-15.
 */


Router.configure({
    layoutTemplate:'main'
});

Router.map(function(){
    this.route('NoteList',{path:'/'});

    this.route('group',{path:'/group'});


    this.route('contactUs', {path:'/contactUs'});

    this.route('aboutUs', {path:'/aboutUs'});

    this.route('help', {path:'/help'});

    this.route('tagList', {path:'/tagList'});

});