Meteor.publish('groupList', function(strToSearch) {
    var currentUserId = this.userId;
    if (strToSearch != undefined && strToSearch != null && strToSearch != '') {
        return groupList.find({"GroupName": {$regex: strToSearch}, CreatedBy: currentUserId});
    }
    else {
        return groupList.find({CreatedBy: currentUserId});
    }
});

Meteor.methods({
    'addUpdateGroup': function( type, groupId, groupName ){
        var currentUserId = Meteor.userId();
        if(type == 'addGroup') {
            var ret =  groupList.insert({
                GroupName: groupName,
                CreatedBy: currentUserId,
                CreatedDate: new Date(),
                LastUpdated: new Date()
            });
            return ret;
        }else{
            groupList.update(groupId, {$set: {
                GroupName: groupName, LastUpdated: new Date()}
            });
        }
    },

    'removeGroup': function (groupId) {
        groupList.remove(groupId);
    }
});