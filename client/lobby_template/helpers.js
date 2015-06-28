if (Meteor.isClient){

  Template.lobbyTemplate.helpers({
    accessToken: function(){
      Meteor.subscribe('gamesById', Session.get('gameId'));

      var game = Games.findOne({_id: Session.get('gameId')})
      if (game === undefined) return ''; // TODO: Add validation

      return game.accessToken;
    },
    players: function(){
      Meteor.subscribe('playersByGameId', Session.get('gameId'));

      return Players.find({gameId: Session.get('gameId')});
    },
    noOfPlayers: function(){
      return noOfPlayers();
    },
    invalidGame: function(){
      return noOfPlayers() < 5;
    },
    isMaxPlayers: function(){
      return noOfPlayers() == 10;
    }
  });


  Template.lobbyPlayerTemplate.helpers({
    isCurrent: function(){
      return this._id === Session.get('playerId');
    },
  })


  var noOfPlayers = function(){
    return Players.find({gameId: Session.get('gameId')}).count();
  }

}
