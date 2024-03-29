
Session.setDefault('groupMode','addGroup');
Session.setDefault('groupId', '');
Session.setDefault('selectedNoteList','');

groupSubscription=Meteor.subscribe('groupList');

clearGroupSessions= function () {
    $('#groupName')[0].value = "";
    $('.noteChkbox').removeAttr('checked');
    Session.set('groupMode', 'addGroup');
    Session.set('groupId', '');
    $('#groupName').focus();
}

getSelectedNoteIds= function () {
    var lst = '';
    var chkLst = $('.noteChkbox');
    for (i = 0; i < chkLst.length; i++) {
        var me = chkLst[i];
        if (me.checked) {
            if (lst == '') {
                lst = me.name;
            } else {
                lst += ',' + me.name;
            }
        }
    }
    return lst;
}

setSelectedNoteIds=function(noteIds) {
    var ids = noteIds.split(',');

    for (i = 0; i < ids.length; i++) {
        var chkLst = $('.noteChkbox');
        for (j = 0; j < chkLst.length; j++) {
            if (chkLst[j].name == ids[i]) {
                chkLst[j].checked=true;
            }
        }
    }
}

Template.groups.helpers({
    'getGroups': function () {
        return groupList.find({}, {sort: {GroupName: 1}});
    },

    'CreatedDate': function () {
        var me = this;
        return getFormatedDate(me.CreatedDate, false);
    },

    'groupCreatedDate': function(){
        var nt = groupList.findOne(Session.get('noteId'));
        if(nt != undefined && nt!= null) {
            return getFormatedDate(nt.CreatedDate, true);
        }else {
            return null;
        }
    },

    'groupLastUpdated': function () {
        var nt = groupList.findOne(Session.get('noteId'));
        if (nt != undefined && nt != null) {
            return getFormatedDate(nt.LastUpdated, true);
        } else {
            return null;
        }
    },

    'getNotes': function () {
        //var currentUserId = Meteor.userId();
        return noteList.find({IsTrash: false}, {sort: {NoteTitle: 1}});
    }
});

Template.groups.events({
    'click .btnSaveGroup': function () {

        var gNm = $('#groupName')[0].value;
        var nIds = getSelectedNoteIds();
        if(gNm == undefined || gNm == '' || gNm == null){
            //alert("Group Name can not be empty");
            bootbox.alert("Group Name can not be empty");
        } else {
            if(gNm.trim().length==0){
                //alert("Group Name can not be empty");
                bootbox.alert("Group Name can not be empty");
            }else if(nIds == ''){
                //alert("Please select atleast one note.");
                bootbox.alert("Please select atleast one note.");
            }
            else {
                Meteor.call('addUpdateGroup', Session.get('groupMode'), Session.get('groupId'), gNm, nIds, function (error, response) {
                    if (error) {
                        console.log('ERROR :', error);
                    } else {
                        console.log('response:', response);
                    }
                    clearGroupSessions();
                });
            }
        }
    },

    "click .btnClearGroup": function(){
        clearGroupSessions();
        //$('#groupName')[0].value = "";
        //
        //Session.set('groupMode','addGroup');
        //Session.set('groupId', '');
        //$('#groupName').focus();
    },

    'click .deleteGroup': function(){
        var me = this;
        var gNm = me.GroupName;

        bootbox.confirm("Are you sure you want to delete \"" + gNm + "\"", function (result) {
            if (result) {
                //PlayersList.remove(selectedPlayer);
                Meteor.call('removeGroup', me._id, function (error, response) {
                    if (error) {
                        console.log('ERROR :', error);
                    } else {
                        console.log('response:', response);
                    }
                    clearGroupSessions();
                });
            }
        });
    },

    'click .editGroup': function(){
        var me=this;
        clearGroupSessions();
        $('#groupName')[0].value = me.GroupName;
        if(me.NoteIds != '' && me.NoteIds != null && me.NoteIds != undefined){
            setSelectedNoteIds(me.NoteIds);
        }
        Session.set('groupMode','editGroup');
        Session.set('groupId', me._id);

        $('#groupName').focus();
    },

    'click .searchGroup':function(){
        var strToSearch=$("#txtGroupSearch")[0].value;

        if (groupSubscription != null) {
            groupSubscription.stop();
        }
        groupSubscription=  Meteor.subscribe('groupList',strToSearch);

    },
    
    'click .noteChkbox': function () {

        //var me = this;
        //var nLst = Session.get('selectedNoteList');
        //var selNLst = '';
        //if (nLst != undefined && nLst != null && nLst != '') {
        //    if(nLst.indexOf(this._id)==-1) {
        //        nLst += ',' + this._id;
        //    }
        //} else {
        //    nLst = this._id;
        //}
        //Session.set('selectedNoteList', nLst);
    },

    'click .shareGroupNote': function () {
        var me= this;
        var ntIds= this.NoteIds;
        //var msgDet =me.NoteDetails;
        var str ='';
        str+= '<div class="row">' +
        '<div class="col-md-12">' +
        '<form class="form-horizontal">' +
        '<div class="form-group">' +
        '<label class="col-md-3 control-label" for="name">Email Id(s): </label>' +
        '<div class="col-md-8">' +
        '<textarea id="name" name="name" class="form-control custom-control htmlEditorJumbotron" rows="10" placeholder="Enter multiple email ids with coma seprated"></textarea>' +
        '</div></div></form></div></div>';
        bootbox.dialog({
                title: "Enter email address to share (Multiple email with comma separated",
                message: str,
                buttons: {
                    success: {
                        label: "Share",
                        className: "btn-success",
                        callback: function () {
                            var name = $('#name').val();
                            var from = Meteor.user().emails[0].address;
                            if (name != undefined && name != null && name != '') {
                                //if (name.indexOf(',') != -1) {
                                    var mulEmIds = name.split(',');
                                    for (i = 0; i < mulEmIds.length; i++) {
                                        if (ntIds != undefined && ntIds != null && ntIds != '') {
                                            //if (ntIds.indexOf(',') != -1) {
                                                var mulNtIds = ntIds.split(',');
                                                for (j = 0; j < mulNtIds.length; j++) {
                                                    var ntDet = noteList.findOne({_id: mulNtIds[j]});
                                                    if(ntDet != undefined && ntDet != null && ntDet != ''){
                                                        Meteor.call('sendEmail', mulEmIds[i].trim(), from, ntDet.NoteTitle, ntDet.NoteDetails);
                                                    }
                                                }
                                            //} else {
                                            //    var ntDet = noteList.findOne({NoteId: mulNtIds[j]});
                                            //    if(ntDet != undefined && ntDet != null && ntDet != ''){
                                            //        Meteor.call('sendEmail', mulEmIds[i].trim(), from, ntDet.NoteTitle, ntDet.NoteDetails);
                                            //    }
                                            //}
                                        }
                                        //Meteor.call('sendEmail', mulEmIds[i].trim(), from, me.NoteTitle, msgDet);
                                    }
                                //} else {
                                //    Meteor.call('sendEmail', name.trim(), from, me.NoteTitle, msgDet);
                                //}
                            }
                        }
                    }
                }
            }
        );
    }
});

//Template.groups.events({
//    //'click .caretClick': function(){
//    //    var options = [];
//    //
//    //
//    //    $('.dropdown-menu a').on('click', function (event) {
//    //
//    //        var $target = $(event.currentTarget),
//    //            val = $target.attr('data-value'),
//    //            $inp = $target.find('input'),
//    //            idx;
//    //
//    //        if (( idx = options.indexOf(val) ) > -1) {
//    //            options.splice(idx, 1);
//    //            setTimeout(function () {
//    //                $inp.prop('checked', false)
//    //            }, 0);
//    //        } else {
//    //            options.push(val);
//    //            setTimeout(function () {
//    //                $inp.prop('checked', true)
//    //            }, 0);
//    //        }
//    //
//    //        $(event.target).blur();
//    //
//    //        console.log(options);
//    //        return false;
//    //    });
//    //}
//
//});