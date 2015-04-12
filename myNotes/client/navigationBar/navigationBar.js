/**
 * Created by sumit on 4/12/2015.
 */
Template.navigationBar.helpers({
    'noteCount':function(){
        if(noteList.find().count()>0)
        {
            return '('+noteList.find().count()+')';
        }
        else{
            return '';
        }
}
});