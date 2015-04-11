/**
 * Created by Shaishav on 11-04-2015.
 */
Meteor.subscribe('historyList');
Status = {
    Insert: "Inserted",
    Update: "Updated",
    Delete: "deleted"

};
Type = {
    Note: "Note",
    Tag: "Tag",
    Group: "Group",
    Share: "Share"

};
clsHistory = function () {
    this.historyDataId= null;
    this.historyDetails = null;
    this.changedBy = "";
    this.changedDate = "";
    this.status = "";
    this.type = "";
}



clsHistory.prototype.createHistoryForNote=function(noteId,status,title,noteDetails){
    var userId = Meteor.userId();
    var objHistoryData = new clsHistory();

    var randomNo = 1 + Math.floor(Math.random() * 6);
    var Id = 'history-' + randomNo + '-' + new Date().getTime();

    objHistoryData.historyDataId=Id;
    objHistoryData.changedBy = userId;
    objHistoryData.changedDate = new Date();
    objHistoryData.status = status;
    objHistoryData.type = Type.Note;
    objHistoryData.historyDetails={};
    if(status==Status.Insert)
    {
        objHistoryData.historyDetails.title=title;
        objHistoryData.historyDetails.noteDetails=noteDetails;
    }
    else if(status==Status.Update)
    {
        objHistoryData.historyDetails.oldtitle=Session.get('oldTitle');
        objHistoryData.historyDetails.newtitle=title;
        objHistoryData.historyDetails.oldNoteDetails=Session.get('oldNoteDetails');
        objHistoryData.historyDetails.newNoteDetails=noteDetails;
    }
    else if(status==Status.Delete)
    {
        objHistoryData.historyDetails.reason=title;
    }
    Meteor.call('addHistory', noteId , objHistoryData);
}


clsHistory.prototype.getHistory= function () {
    var noteId = Session.get('noteId');
    return historyList.find({NoteId: noteId});
}



