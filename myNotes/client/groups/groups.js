
Session.setDefault('groupMode','addGroup');
Session.setDefault('groupId', '');

groupSubscription=Meteor.subscribe('groupList');

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
    }
});

Template.groups.events({
    'click .btnSaveGroup': function () {

        var gNm = $('#groupName')[0].value;

        if(gNm == undefined || gNm == '' || gNm == null){
            alert("Note Title can not be empty");
        } else {
            if(gNm.trim().length==0){
                alert("Note Title can not be empty");
            }else {
                Meteor.call('addUpdateGroup', Session.get('groupMode'), Session.get('groupId'), gNm, function (error, response) {
                    if (error) {
                        console.log('ERROR :', error);
                    } else {
                        console.log('response:', response);
                    }
                    $('#groupName')[0].value = "";


                    Session.set('groupMode', 'addGroup');
                    Session.set('groupId', '');
                });
            }
        }
    },

    "click .btnClearGroup": function(){
        $('#groupName')[0].value = "";

        Session.set('groupMode','addGroup');
        Session.set('groupId', '');
        $('#groupName').focus();
    },

    'click .deleteGroup': function(){
        var me = this;
        var gNm = me.GroupName;
        var r = confirm("Are you sure you want delete \"" + gNm + "\"");
        if (r == true) {
            //PlayersList.remove(selectedPlayer);
            Meteor.call('removeGroup', me._id, function (error, response) {
                if (error) {
                    console.log('ERROR :', error);
                } else {
                    console.log('response:', response);
                }
            });
        }
    },

    'click .editGroup': function(){
        var me=this;

        $('#groupName')[0].value = me.GroupName;

        Session.set('groupMode','editGroup');
        Session.set('groupId', me._id);

        $('#groupName').focus();
    },


    'click .searchGroup':function(){
        var strToSearch=$("#groupName")[0].value;

        if (groupSubscription != null) {
            groupSubscription.stop();
        }
        groupSubscription=  Meteor.subscribe('groupList',strToSearch);

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