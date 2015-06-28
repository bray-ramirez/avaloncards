Games = new Mongo.Collection('games');
Players = new Mongo.Collection('players');


if (Meteor.isClient){

  var trackTemplate = function(){
    Meteor.subscribe('gamesById', Session.get('gameId'));
    Meteor.subscribe('playersByGameId', Session.get('gameId'));

    var game = Games.findOne({_id: Session.get('gameId')}),
        player = Players.findOne({
                      _id: Session.get('playerId'),
                      gameId: Session.get('gameId')
                    });

    if (game === undefined || player === undefined){
      Session.set('currentTemplate', 'mainTemplate');

      return;
    }

    if (game.status === 0){
      Session.set('currentTemplate', 'lobbyTemplate')
    }
    else if (game.status === 1){
      Session.set('currentTemplate', 'inGameTemplate')
    }
  }

  Tracker.autorun(trackTemplate);
}


if (Meteor.isServer) {

  Meteor.publish('gamesById', function(gameId){
    return Games.find({_id: gameId});
  });


  Meteor.publish('gamesByAccessToken', function(accessToken){
    return Games.find({accessToken: accessToken});
  });


  Meteor.publish('playersByGameId', function(gameId){
    return Players.find({gameId: gameId});
  });


  Meteor.publish('playersByPlayerToken', function(playerToken){
    return Players.find({playerToken: playerToken});
  });
}


Meteor.methods({
  createGame: function(){
    return Games.insert({
      accessToken: generateToken(6),
      status: 0,
      createAt: new Date()
    });
  },
  startGame: function(gameId){
    Games.update(gameId, {$set: {status: 1}});
  },
  endGame: function(gameId){
    Games.update(gameId, {$set: {status: 0}});
  },
  createPlayer: function(params){
    params.playerToken = generateToken(3);

    return Players.insert(params);
  },
  updatePlayerRole: function(playerId, params){
    Players.update(playerId, {$set: params});
  },
  resetPlayerRole: function(playerId){
    Players.update(playerId,
      {$set: {
        characterName: null,
        evil: false,
        ability: null,
        visibleToMerlin: false,
        visibleToEvil: false,
        visibleToPercival: false,
        isMerlin: false,
        isPercival: false,
        isOberon: false}});
  },
  removePlayer: function(playerId){
    Players.remove(playerId);
  }
})


var generateToken = function(length){
  var token = '',
      possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++){
    token += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return token;
}
