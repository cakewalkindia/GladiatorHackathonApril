/**
 * Created by Shaishav on 11-04-2015.
 */
Meteor.publish('historyList', function(){
    return historyList.find();
});

Meteor.methods({
    'addHistory': function( noteId, historyData ){
        var history = historyList.find({NoteId: noteId});

        if(history.count()>0){
            var hisData= history.fetch()[0].HistoryData;
            hisData.push(historyData);
            historyList.update(history.fetch()[0]._id, {$set: {NoteId: noteId, HistoryData: hisData} });
        }
        else
        {
            var arr=[]
            arr.push(historyData)
            historyList.insert({
                NoteId: noteId,
                HistoryData: arr
            });

        }
    },
    'getHistory': function(noteId){
        var history = historyList.find({NoteId: noteId});
    }

});


