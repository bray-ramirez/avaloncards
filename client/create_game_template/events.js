if (Meteor.isClient){

  Template.createGameTemplate.events({
    'click .js-back': function(){
      Session.set('currentTemplate', 'mainTemplate');

      return false;
    },
    'submit .js-create-game': function(event){
      var playerName = event.target.playerName.value;

      Meteor.call('createGame',
        function(error, result){
          var gameId = result;

          Session.set('gameId', gameId);

          Meteor.call('createPlayer',
            {name: playerName, gameId: gameId},
            function(error, result){
              Session.set('playerId', result);
            }
          )
        }
      )

      return false;
    }
  });

}
