/**
 * Created by soheb on 11-Apr-15.
 */

Session.setDefault('noteMode','addNote');
Session.setDefault('noteId', '');
//Session.setDefault('editType', 'note');
noteSubscription=Meteor.subscribe('noteList');

getFormatedDate = function (dateToConvert, includeTime) {
    var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if(includeTime) {
        return dateToConvert.getDate() + ' ' + mon[dateToConvert.getMonth() - 1] + ' ' + dateToConvert.getFullYear()
         + ' '  + dateToConvert.toLocaleTimeString();
    }else{
        return dateToConvert.getDate() + ' ' + mon[dateToConvert.getMonth() - 1] + ' ' + dateToConvert.getFullYear();
    }
}

loadHtmlEditor= function () {
    //$(function() {
        $('textarea#noteDetails').editable({
            theme:'royal',
            inlineMode: false,
            placeholder: 'Note details...',
            colors: [
                '#15E67F', '#E3DE8C', '#D8A076', '#D83762', '#76B6D8', 'REMOVE',
                '#1C7A90', '#249CB8', '#4ABED9', '#FBD75B', '#FBE571', '#FFFFFF'
            ],
            minHeight: 220,
            maxHeight: 220,
            showFileUpload: true
        });
    //});
}

clearNoteSessions= function () {
    $('#noteTitle')[0].value = "";
    $('textarea#noteDetails').editable("setHTML", "", false);

    Session.set('noteMode', 'addNote');
    Session.set('noteId', '');

    Session.set('oldTitle', '');
    Session.set('oldNoteDetails', '');
    $('#noteTitle').focus();
}

Template.notes.helpers({
    'isTagVisible': function () {
        loadHtmlEditor();
        if(Session.get('noteMode') == 'editNote'){
            return true;
        }else{
            return false;
        }
    },

    'getNotes': function () {
        //var currentUserId = Meteor.userId();
        return noteList.find({IsTrash: false}, {sort: {NoteTitle: 1}});
    },

    'createdDate': function () {
        var me = this;
        return getFormatedDate(me.CreatedDate, false);
    },

    'noteCreatedDate': function(){
        var nt = noteList.findOne(Session.get('noteId'));
        if(nt != undefined && nt!= null) {
            return getFormatedDate(nt.CreatedDate, true);
        }else {
            return null;
        }
    },

    'noteLastUpdated': function () {
        var nt = noteList.findOne(Session.get('noteId'));
        if (nt != undefined && nt != null) {
            return getFormatedDate(nt.LastUpdated, true);
        } else {
            return null;
        }
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
                Meteor.call('addUpdateNote', Session.get('noteMode'), Session.get('noteId'), nTit, nDet, function (error, response) {
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

                    clearNoteSessions();
                    //$('#noteTitle')[0].value = "";
                    //$('textarea#noteDetails').editable("setHTML", "", false);
                    //
                    //Session.set('noteMode', 'addNote');
                    //Session.set('noteId', '');
                    //
                    //Session.set('oldTitle', '');
                    //Session.set('oldNoteDetails', '');
                });
            }
        }
    },

    "click .btnClearNote": function(){
        clearNoteSessions();
        //$('#noteTitle')[0].value = "";
        //$('textarea#noteDetails').editable("setHTML", "", false);
        //Session.set('noteMode','addNote');
        //Session.set('noteId', '');
        //$('#noteTitle').focus();
    },

    'click .deleteNote': function(){
        var me = this;
        Session.set('noteId', me._id);
        var nTit = me.NoteTitle;
        var r = confirm("Are you sure you want to delete \"" + nTit + "\"");
        if (r == true) {
            //PlayersList.remove(selectedPlayer);
            Meteor.call('removeNote', me._id, function (error, response) {
                if (error) {
                    console.log('ERROR :', error);
                } else {
                    var objHistory= new clsHistory();

                    //add History  for delete
                    objHistory.createHistoryForNote(Session.get('noteId'),Status.Delete, nTit);
                    console.log('response:', response);
                }
                clearNoteSessions();
            });
        }
    },

    'click .editNote': function(){
        var me=this;
        //var noteId = this._id;
        //var note = noteList.findOne(noteId);

        $('#noteTitle')[0].value = me.NoteTitle;
        $('textarea#noteDetails').editable("setHTML", me.NoteDetails, false);
        Session.set('noteMode','editNote');
        Session.set('noteId', me._id);

        Session.set('oldTitle', me.NoteTitle);
        Session.set('oldNoteDetails', me.NoteDetails);

        $('textarea#noteDetails').editable("focus");
        $('#noteTitle').focus();
    },

    'click .addTag': function () {
        $( "#txtTag" ).focus();
    },

    'click .searchNote':function(){
        var strToSearch=$("#txtNoteSearch")[0].value;
        var strParam="";

        if(strToSearch!="")
        {
            if($("#cmbSearch")[0].value=="By Tags")
            {
                strParam= strToSearch +"@@@"+ Type.Tag;
            }
            else if($("#cmbSearch")[0].value=="By Notes")
            {
                strParam=strToSearch +"@@@"+Type.Note;
            }
            else if($("#cmbSearch")[0].value=="By Groups")
            {
                strParam=strToSearch +"@@@"+Type.Group;
            }
        }
        if (noteSubscription != null) {
            noteSubscription.stop();
        }
        noteSubscription=  Meteor.subscribe('noteList',strParam);

    },
    'keyup .tbNoteSearch':function(){
        var strToSearch=$("#txtNoteSearch")[0].value;
        var strParam="";

        if(strToSearch!="")
        {
            if($("#cmbSearch")[0].value=="By Tags")
            {
                strParam= strToSearch +"@@@"+ Type.Tag;
            }
            else if($("#cmbSearch")[0].value=="By Notes")
            {
                strParam=strToSearch +"@@@"+Type.Note;
            }
            else if($("#cmbSearch")[0].value=="By Groups")
            {
                strParam=strToSearch +"@@@"+Type.Group;
            }
        }
        if (noteSubscription != null) {
            noteSubscription.stop();
        }
        noteSubscription=  Meteor.subscribe('noteList',strParam);

    },
    'change .searchBy':function(){

        var strToSearch=$("#txtNoteSearch")[0].value;
        var strParam="";

        if(strToSearch!="")
        {
            if($("#cmbSearch")[0].value=="By Tags")
            {
                strParam= strToSearch +"@@@"+ Type.Tag;
            }
            else if($("#cmbSearch")[0].value=="By Notes")
            {
                strParam=strToSearch +"@@@"+Type.Note;
            }
            else if($("#cmbSearch")[0].value=="By Groups")
            {
                strParam=strToSearch +"@@@"+Type.Group;
            }
        }
        if (noteSubscription != null) {
            noteSubscription.stop();
        }
        noteSubscription=  Meteor.subscribe('noteList',strParam);
    }

});


Template.notes.rendered = function(){
    Session.set('noteMode','addNote');
    Session.set('noteId', '');
    loadHtmlEditor();
}