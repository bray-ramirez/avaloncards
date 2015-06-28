if (Meteor.isClient){

  Template.inGameTemplate.events({
    'click .js-end-game': function(){
      var gameId = Session.get('gameId');

      Meteor.subscribe('playersByGameId', gameId, function(){
        var players = Players.find({gameId: gameId});

        players.forEach(function(player, index){
          Meteor.call('resetPlayerRole', player._id);
        });

        Meteor.call('endGame', Session.get('gameId'));
        Session.set('currentTemplate', 'lobbyTemplate');
      });
    }
  });
}
