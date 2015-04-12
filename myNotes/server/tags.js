Meteor.publish('tagList', function(){
    var currentUserId = this.userId;
    return tagList.find();
});

Meteor.methods({
    'addTag': function( tagName, noteId ) {
        var currentUserId = Meteor.userId();
        var ret=tagList.insert({
            TagName: tagName,
            NoteId: noteId,
            TagBy: currentUserId,
            TagDate: new Date()
        });
        return ret;
    },

    'removeTag': function (tagId) {
        tagList.remove(tagId);
    }
});