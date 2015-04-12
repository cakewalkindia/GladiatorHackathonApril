Meteor.subscribe('sharedByList');

Template.sharedBy.helpers({
    'getSharedByList': function () {
        //var currentUserId = Meteor.userId();
        return sharedByList.find({}, {sort: {SharedDate: -1}});
    },

    'sharedDate': function () {
        var me = this;
        return getFormatedDate(me.SharedDate, false);
    },

    'getNotTitle': function(){
        var me = this;

        return noteList.findOne({_id: me.NoteId}).NoteTitle
    }

});

Template.sharedBy.events({

    'click .deleteSharedBy': function(){
        var me = this;
        bootbox.confirm("Are you sure you want to delete this entry", function (result) {
            if(result) {
                //PlayersList.remove(selectedPlayer);
                Meteor.call('removeSharedBy', me._id, function (error, response) {
                    if (error) {
                        console.log('ERROR :', error);
                    } else {
                        console.log('response:', response);
                    }
                });
            }
        });
    },
});