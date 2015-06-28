if (Meteor.isClient){

  Template.resumeGameTemplate.events({
    'click .js-back': function(){
      Session.set('currentTemplate', 'mainTemplate');

      return false;
    },
    'submit .js-resume-game': function(event){
      var accessToken = event.target.accessToken.value,
          playerToken = event.target.playerToken.value;

      Meteor.subscribe('gamesByAccessToken', accessToken, function(){
        var game = Games.findOne({accessToken: accessToken});

        if (game === undefined){
          return FlashMessages.sendError('Sorry. Game does not exist.');
        }

        Meteor.subscribe('playersByPlayerToken', playerToken, function(){
          player = Players.findOne({gameId: game._id, playerToken: playerToken});

          if (player === undefined){
            return FlashMessages.sendError('Sorry. Player does not exist.');
          }

          Session.set('gameId', game._id);
          Session.set('playerId', player._id);
          Session.set('currentTemplate', 'lobbyTemplate');
        });
      });

      return false;
    }
  })

}
