/**
 * Created by sumit on 4/12/2015.
 */
Template.navigationBar.helpers({
    'noteCount':function(){
        if(noteList.find({IsTrash: false}).count()>0)
        {
            return '('+noteList.find({IsTrash: false}).count()+')';
        }
        else{
            return '';
        }
},
    'groupCount':function(){
        if(groupList.find().count()>0)
        {
            return '('+ groupList.find().count() +')';
        }
        else{
            return '';
        }
    },
    'trashCount':function(){
        if(noteList.find({IsTrash: true}).count()>0)
        {
            return '('+ noteList.find({IsTrash: true}).count() +')';
        }
        else{
            return '';
        }
    },
    'getUserName':function()
    {
      return  Meteor.user().profile["first-name"] ;
    }

});