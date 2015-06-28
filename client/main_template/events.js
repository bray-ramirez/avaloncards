if (Meteor.isClient){

  Template.mainTemplate.events({
    'click .js-create-game': function(){
      Session.set('currentTemplate', 'createGameTemplate');
    },
    'click .js-join-game': function(){
      Session.set('currentTemplate', 'joinGameTemplate');
    },
    'click .js-resume-game': function(){
      Session.set('currentTemplate', 'resumeGameTemplate');
    }
  });

}
