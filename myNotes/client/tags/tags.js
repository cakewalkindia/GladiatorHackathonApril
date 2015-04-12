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
                    if (error) {
                        console.log('ERROR :', error);
                    } else {
                        console.log('response:', response);
                        var objHistory= new clsHistory();
                        //add History  for delete
                        var tDet=tagList.findOne(response);
                        objHistory.createHistoryForTag(tDet.NoteId,response,Status.Insert, tDet.TagName);
                    }
                    $('#txtTag')[0].value = "";
                });
            }
        }
    },

    'click .removeTag' : function(){
        var tagId = this._id;

        var tDet = tagList.findOne(tagId);
        var r = confirm("Are you sure you want delete \"" + tDet.TagName + "\"");
        if (r == true) {
            //PlayersList.remove(selectedPlayer);
            Meteor.call('removeTag', tagId, function (error, response) {
                if (error) {
                    console.log('ERROR :', error);
                } else {
                    console.log('response:', response);
                    var objHistory= new clsHistory();

                    //add History  for delete
                    objHistory.createHistoryForTag(tDet.NoteId,tDet._id,Status.Delete, tDet.TagName);
                }
            });
        }
    }
});