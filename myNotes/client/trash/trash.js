//noteSubscription=Meteor.subscribe('noteList');


Template.trash.helpers({
    'getNotes': function () {
        //var currentUserId = Meteor.userId();
        return noteList.find({IsTrash: true}, {sort: {NoteTitle: 1}});
    }
});

Template.trash.events({
    'click .deleteTrashNote': function(){
        var me = this;
        Session.set('noteId', me._id);
        var nTit = me.NoteTitle;
        var r = confirm("Are you sure you want to permanently delete \"" + nTit + "\"");
        if (r == true) {
            Meteor.call('removeTrashNote', me._id, function (error, response) {
                if (error) {
                    console.log('ERROR :', error);
                } else {
                    var objHistory= new clsHistory();

                    //add History  for delete
                    objHistory.createHistoryForNote(Session.get('noteId'),Status.Delete, nTit);
                    console.log('response:', response);
                }
                clearNoteSessions();
            });
        }
    },

    'click .restoreTrashNote' : function(){
        var me = this;
        Session.set('noteId', me._id);
        var nTit = me.NoteTitle;
        var r = confirm("Are you sure you want to restore \"" + nTit + "\"");
        if (r == true) {
            Meteor.call('restoreTrashNote', me._id, function (error, response) {
                if (error) {
                    console.log('ERROR :', error);
                } else {
                    var objHistory= new clsHistory();

                    //add History  for delete
                    objHistory.createHistoryForNote(Session.get('noteId'),Status.Delete, nTit);
                    console.log('response:', response);
                }
                clearNoteSessions();
            });
        }
    }
});


