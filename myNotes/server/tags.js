Meteor.publish('tagList', function(){
    var currentUserId = this.userId;
    return tagList.find();
});

Meteor.methods({
    'addTag': function( tagName, noteId ) {
        var currentUserId = Meteor.userId();
        tagList.insert({
            TagName: tagName,
            NoteId: noteId,
            TagBy: currentUserId,
            TagDate: new Date()
        });
    },

    'removeTag': function (tagId) {
        tagList.remove(tagId);
    }
});