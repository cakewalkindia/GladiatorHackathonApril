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
        objHistoryData.historyDetails.title=title;
        objHistoryData.historyDetails.oldNoteDetails=Session.get('oldNoteDetails');
        objHistoryData.historyDetails.noteDetails=noteDetails;
    }
    else if(status==Status.Delete)
    {
        objHistoryData.historyDetails.reason=title;
    }
    Meteor.call('addHistory', noteId , objHistoryData);
}





historySubscription=Meteor.subscribe('historyList');


Template.history.helpers({
    getHistory: function () {
        var noteId = Session.get('noteId');
        //var currentUserId = Meteor.userId();
        return Meteor.call('getHistory', noteId);

    },
    getHistoryList:function(){
        var noteId = Session.get('noteId');
        var hist = historyList.find({NoteId:noteId}).fetch();


        var arrDates=_.pluck(hist[0].HistoryData, 'changedDate');

        var uniqDates=arrDates.unique();

        var arrReturnList=[];
        for(i = 0; i < uniqDates.length; i++){

            var obj={date:'',data:[]}
            for(j = 0; j < hist[0].HistoryData.length; j++){
                if(uniqDates[i] === hist[0].HistoryData[j].changedDate.toDateString())
                {
                    obj.date = getFormatedDate(hist[0].HistoryData[j].changedDate,false);
                    if(hist[0].HistoryData[j].status==Status.Insert)
                    {
                        hist[0].HistoryData[j].message="Created Note";
                    }
                    else if(hist[0].HistoryData[j].status==Status.Update)
                    {
                        hist[0].HistoryData[j].message="Modified Note";
                    }
                    else if(hist[0].HistoryData[j].status==Status.Delete)
                    {
                        hist[0].HistoryData[j].message="Deleted Note";
                    }
                    hist[0].HistoryData[j].time= new Date(hist[0].HistoryData[j].changedDate).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
                    hist[0].HistoryData[j].uName=Meteor.users.find({_id:hist[0].HistoryData[j].changedBy}).fetch()[0].profile["first-name"];
                    obj.data.push(hist[0].HistoryData[j]);

                }
            }
            arrReturnList.push(obj);
        }
        return arrReturnList;
    }
});


Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v.toDateString())  return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            //var options = {  year: 'numeric', month: 'long', day: 'numeric' };

            //a.toLocaleDateString('de-DE', options)
            arr.push(this[i].toDateString());
        }
    }
    return arr;
}