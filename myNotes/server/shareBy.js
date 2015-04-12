Meteor.publish('sharedByList', function() {
    var currentUserId = this.userId;
    return sharedByList.find({SharedBy: currentUserId});
});


Meteor.methods({
    'addSharedBy': function (noteId, sharedWith ) {
        var currentUserId = Meteor.userId();
        var ret =  sharedByList.insert({
            NoteId: noteId,
            SharedBy: currentUserId,
            SharedWith: sharedWith,
            SharedDate: new Date()
        });
    },

    'removeSharedBy': function(sharedById) {
        sharedByList.remove(sharedById);
    }
});