if (Meteor.isClient){

  Template.body.helpers({
    currentTemplate: function(){
      var currentTemplate = Session.get('currentTemplate');

      if (currentTemplate === undefined) return 'mainTemplate';

      return currentTemplate;
    }
  });

}
