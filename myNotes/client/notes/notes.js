/**
 * Created by soheb on 11-Apr-15.
 */

Session.setDefault('noteMode','addNote');
Session.setDefault('noteId', '');



noteSubscription=Meteor.subscribe('noteList');


Template.notes.helpers({
    'isTagVisible': function () {
        if(Session.get('noteMode') == 'editNote'){
            return true;
        }else{
            return false;
        }
    },

    getNotes: function () {
        //var currentUserId = Meteor.userId();
        return noteList.find({}, {sort: {NoteTitle: 1}});
    },

    'CreatedDate': function () {
        var me = this;
        return me.CreatedDate.toDateString();
    }
});

Template.notes.events({
    'click .btnSaveNote': function () {
        var objHistory= new clsHistory();

        var nTit = $('#noteTitle')[0].value;
        var nDet = $('textarea#noteDetails').editable("getHTML", true, true); //$('#noteDetails')[0].value;


        if(nTit == undefined || nTit == '' || nTit == null){
            alert("Note Title can not be empty");
        } else {
            if(nTit.trim().length==0){
                alert("Note Title can not be empty");
            }else {
                Meteor.call('addNote', Session.get('noteMode'), Session.get('noteId'), nTit, nDet, function (error, response) {
                    if (error) {
                        console.log('ERROR :', error);
                    } else {
                        console.log('response:', response);
                        if (Session.get('noteId') != "") {
                            objHistory.createHistoryForNote(Session.get('noteId'), Status.Update, nTit, nDet)
                        }
                        else {
                            objHistory.createHistoryForNote(response, Status.Insert, nTit, nDet)
                        }
                    }
                    $('#noteTitle')[0].value = "";
                    $('textarea#noteDetails').editable("setHTML", "", false);

                    Session.set('noteMode', 'addNote');
                    Session.set('noteId', '');

                    Session.set('oldTitle', '');
                    Session.set('oldNoteDetails', '');
                });
            }
        }
    },

    'click .btnCreateNote': function(){
        $('#noteTitle')[0].value = "";
        $('textarea#noteDetails').editable("setHTML", "", false);
        Session.set('noteMode','addNote');
        Session.set('noteId', '');
        $('#noteTitle').focus();
    },

    'click .btnSaveTag': function () {
        var tagName = $('#txtTag')[0].value;
    },

    'click .deleteNote': function(){
        var noteId = this._id;

        var nTit = noteList.findOne(noteId).NoteTitle;
        var r = confirm("Are you sure you want delete \"" + nTit + "\"");
        if (r == true) {
            //PlayersList.remove(selectedPlayer);
            Meteor.call('removeNote', noteId, function (error, response) {
                if (error) {
                    console.log('ERROR :', error);
                } else {
                    var objHistory= new clsHistory();

                    //add History  for delete
                    objHistory.createHistoryForNote(noteId,Status.Delete, nTit)
                    console.log('response:', response);
                }
            });
        }
    },

    'click .editNote': function(){
        var noteId = this._id;
        var note = noteList.findOne(noteId);

        $('#noteTitle')[0].value = note.NoteTitle;
        $('textarea#noteDetails').editable("setHTML", note.NoteDetails, false);
        Session.set('noteMode','editNote');
        Session.set('noteId', noteId);

        Session.set('oldTitle', note.NoteTitle);
        Session.set('oldNoteDetails', note.NoteDetails);

        $('textarea#noteDetails').editable("focus");
        $('#noteTitle').focus();
    },
    'click .searchNote':function(){
        var strToSearch=$("#txtSearch")[0].value;
        var strParam="";

        if(strToSearch!="")
        {
            if($("#cmbSearch")[0].value=="By Tag")
            {
                strParam= strToSearch +"@@@"+"Tag";
            }
            else if($("#cmbSearch")[0].value=="By Notes")
            {
                strParam=strToSearch +"@@@"+"Note";
            }
        }
        if (noteSubscription != null) {
            noteSubscription.stop();
        }
        noteSubscription=  Meteor.subscribe('noteList',strParam);

    }
});

