if (Meteor.isClient){

  Template.joinGameTemplate.events({
    'click .js-back': function(){
      Session.set('currentTemplate', 'mainTemplate');

      return false;
    },
    'submit .js-join-game': function(event){
      var accessToken = event.target.accessToken.value,
          playerName = event.target.playerName.value;

      Meteor.subscribe('gamesByAccessToken', accessToken, function(){
        var game = Games.findOne({accessToken: accessToken}),
            noOfPlayers = Players.find({gameId: game._id}).count();

        if (noOfPlayers === 10){
          return FlashMessages.sendError('Sorry. Game is already full.');
        }

        Session.set('gameId', game._id);

        Meteor.call('createPlayer',
          {name: playerName, gameId: game._id},
          function(error, result){
            Session.set('playerId', result);
            Session.set('currentTemplate', 'lobbyTemplate');
          }
        );
      });

      return false;
    }
  })

}
