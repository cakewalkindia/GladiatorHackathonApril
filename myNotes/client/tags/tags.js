/**
 * Created by SOHEB.RAPATI on 10-04-2015.
 */

Meteor.subscribe('tagList');

Template.tags.helpers({
    getTags: function () {
        var noteId = Session.get('noteId');
        return tagList.find({NoteId: noteId}, {sort: {TagName: 1}});
    }
});

Template.tags.events({
    'submit form': function(event){
        event.preventDefault();
        var tagName = event.target.tagName.value;

        if(tagName == undefined || tagName == '' || tagName == null){
            alert("Tag Name can not be empty");
        } else {
            if(tagName.trim().length==0){
                alert("Tag Name can not be empty");
            }else {
                Meteor.call('addTag', tagName, Session.get('noteId'), function (error, response) {
                    //if (error) {
                    //    console.log('ERROR :', error);
                    //} else {
                    //    console.log('response:', response);
                    //}
                    $('#txtTag')[0].value = "";
                });
            }
        }
    },

    'click .removeTag' : function(){
        var tagId = this._id;

        var tName = tagList.findOne(tagId).TagName;
        var r = confirm("Are you sure you want delete \"" + tName + "\"");
        if (r == true) {
            //PlayersList.remove(selectedPlayer);
            Meteor.call('removeTag', tagId, function (error, response) {
                if (error) {
                    console.log('ERROR :', error);
                } else {
                    console.log('response:', response);
                }
            });
        }
    }
});