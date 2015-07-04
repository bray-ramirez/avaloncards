if (Meteor.isClient){

  Template.lobbyTemplate.helpers({
    accessToken: function(){
      Meteor.subscribe('gamesById', Session.get('gameId'));

      var game = Games.findOne({_id: Session.get('gameId')});
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
    isMerlinGameModeChecked: function(){
      var game = Games.findOne({_id: Session.get('gameId')});

      if (game === undefined) return false;

      return game.merlinGameMode;
    },
    isPercivalGameModeChecked: function(){
      var game = Games.findOne({_id: Session.get('gameId')});

      if (game === undefined) return false;
      return game.percivalGameMode;
    },
    isMordredGameModeChecked: function(){
      var game = Games.findOne({_id: Session.get('gameId')});

      if (game === undefined) return false;
      return game.mordredGameMode;
    },
    isOberonGameModeChecked: function(){
      var game = Games.findOne({_id: Session.get('gameId')});

      if (game === undefined) return false;
      return game.oberonGameMode;
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
