//Meteor.publish('trashNoteList', function() {
//    var currentUserId = this.userId;
//    return noteList.find({CreatedBy: currentUserId, IsTrash: true});
//});

Meteor.methods({
    'removeTrashNote': function (noteId) {
        noteList.remove(noteId);
    },

    'restoreTrashNote': function (noteId) {
        noteList.update(noteId, {$set: {IsTrash: false}});
    }
});