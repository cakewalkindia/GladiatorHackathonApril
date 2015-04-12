/**
 * Created by sumit on 4/12/2015.
 */
Template.navigationBar.helpers({
    'noteCount':function(){
    return noteList.find().count();
}
});