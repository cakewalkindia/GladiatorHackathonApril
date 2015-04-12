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
        //Session.set('noteId', me._id);
        //var nTit = me.NoteTitle;

        bootbox.confirm("Are you sure you want to permanently delete \"" + me.NoteTitle + "\"", function (result) {
            if (result) {
                Meteor.call('removeTrashNote', me._id, function (error, response) {
                    if (error) {
                        console.log('ERROR :', error);
                    } else {
                        var objHistory= new clsHistory();

                        //add History  for delete
                        objHistory.createHistoryForNote(me._id,Status.PDelete, me.NoteTitle);
                        console.log('response:', response);
                    }
                });
            }
        });
    },

    'click .restoreTrashNote' : function(){
        var me = this;
        //Session.set('noteId', me._id);
        //var nTit = me.NoteTitle;

        bootbox.confirm("Are you sure you want to restore \"" + me.NoteTitle + "\"", function (result) {
            if (result) {
                Meteor.call('restoreTrashNote', me._id, function (error, response) {
                    if (error) {
                        console.log('ERROR :', error);
                    } else {
                        var objHistory = new clsHistory();

                        //add History  for delete
                        objHistory.createHistoryForNote(me._id, Status.Restore, me.NoteTitle, me.NoteDetails);
                        console.log('response:', response);
                    }
                });
            }
        });
    }
});


