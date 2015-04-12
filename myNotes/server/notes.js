/**
 * Created by soheb on 11-Apr-15.
 */


Meteor.publish('noteList', function(strParam){

    var currentUserId = this.userId;
    if(strParam!=undefined)
    {
        var strToSearch=strParam.split('@@@')[0];
        var type=strParam.split('@@@')[1];

        if(type=="Tag")
        {
            var arrId=[];
            tagList.find({ "TagName" :{ $regex:strToSearch} }).fetch().forEach(function(doc) {arrId.push(doc.NoteId)});
            return noteList.find({ _id : { $in : arrId },CreatedBy: currentUserId });
        }
        else if(type=="Note")
        {
            if(noteList.find({"NoteTitle": { $regex:strToSearch},CreatedBy: currentUserId}).count()>0)
                return noteList.find({"NoteTitle": { $regex:strToSearch},CreatedBy: currentUserId});
            else
                return null;
            //return noteList.find({CreatedBy: currentUserId});
        }
        else {
            return noteList.find({CreatedBy: currentUserId});
        }
    }
    else {
        return noteList.find({CreatedBy: currentUserId});
    }


});

Meteor.methods({
    'addUpdateNote': function( type, noteId, noteTitle, noteDetails ){
        var currentUserId = Meteor.userId();
        if(type == 'addNote') {
            var ret =  noteList.insert({
                NoteTitle: noteTitle,
                NoteDetails: noteDetails,
                CreatedBy: currentUserId,
                CreatedDate: new Date(),
                LastUpdated: new Date(),
                IsTrash:false
            });
            return ret;
        }else{
            noteList.update(noteId, {$set: {
                NoteTitle: noteTitle, NoteDetails: noteDetails, LastUpdated: new Date()}
            });

        }
    },

    'removeNote': function (noteId) {
        //noteList.remove(noteId);
        noteList.update(noteId, {$set: {IsTrash: true}});
    }
});


