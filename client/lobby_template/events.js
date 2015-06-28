if (Meteor.isClient){

  Template.lobbyTemplate.events({
    'click .js-leave-game': function(){
      Meteor.call('removePlayer', Session.get('playerId'));

      Session.set('gameId', null);
      Session.set('playerId', null);
      Session.set('currentTemplate', 'joinGameTemplate');

      return false;
    },
    'submit .js-start-game': function(event){
      var gameId = Session.get('gameId');

      Meteor.subscribe('playersByGameId', gameId, function(){
        var players = Players.find({gameId: gameId}),
            noOfPlayers = players.count(),
            totalMinions = noOfMinions[noOfPlayers],
            minionsIndex = [],
            assignedIndex = [];

        // Special Characters
        var isMerlinSelected = event.target.merlin.checked,
            isPercivalSelected = event.target.percival.checked,
            isMordredSelected = false,
            isOberonSelected = false;

        if (noOfPlayers === 10){
          isMordredSelected = event.target.mordred.checked;
          isOberonSelected = event.target.oberon.checked;
        }


        var merlinIndex = null,
            percivalIndex = null,
            assassinIndex = null,
            morganaIndex = null,
            mordredIndex = null,
            oberonIndex = null;


        if (isMerlinSelected){
          // Assign Merlin
          merlinIndex = randomizer(noOfPlayers);
          assignedIndex.push(merlinIndex);

          // Assign Assassin
          assassinIndex = selectPlayer(noOfPlayers, assignedIndex);
          assignedIndex.push(assassinIndex);
          minionsIndex.push(assassinIndex);
        }

        if (isMerlinSelected && isPercivalSelected){
          // Assign Percival
          percivalIndex = selectPlayer(noOfPlayers, assignedIndex);
          assignedIndex.push(percivalIndex);

          // Assign Morgana
          morganaIndex = selectPlayer(noOfPlayers, assignedIndex);
          assignedIndex.push(morganaIndex);
          minionsIndex.push(morganaIndex);
        }


        if (isMordredSelected && minionsIndex.length < totalMinions){
          mordredIndex = selectPlayer(noOfPlayers, assignedIndex);
          assignedIndex.push(mordredIndex);
          minionsIndex.push(mordredIndex);
        }


        if (isOberonSelected && minionsIndex.length < totalMinions){
          oberonIndex = selectPlayer(noOfPlayers, assignedIndex);
          assignedIndex.push(oberonIndex);
          minionsIndex.push(oberonIndex);
        }


        // Distribute remaining minions
        while(minionsIndex.length < totalMinions){
          var index = selectPlayer(noOfPlayers, assignedIndex);
          minionsIndex.push(index);
          assignedIndex.push(index);
        }


        players.forEach(function(player, index){
          var params = roles[0]; // Default to Good

          switch(index){
            case merlinIndex:
              params = roles[2];
              break;
            case percivalIndex:
              params = roles[3];
              break;
            case assassinIndex:
              params = roles[4];
              break;
            case morganaIndex:
              params = roles[5];
              break;
            case mordredIndex:
              params = roles[6];
              break;
            case oberonIndex:
              params = roles[7];
              break;
            default:
              if (minionsIndex.indexOf(index) >= 0){
                params = roles[1];
              }
          }

          Meteor.call('updatePlayerRole', player._id, params);
        });

        Meteor.call('startGame', gameId);
        Session.set('currentTemplate', 'inGameTemplate');
      });

      return false;
    }
  });


  Template.lobbyPlayerTemplate.events({
    'click .js-remove-player': function(){
      Meteor.call('removePlayer', this._id);
    }
  });

}


var randomizer = function(maxLimit){
  return Math.floor((Math.random() * maxLimit));
}


var selectPlayer = function(maxLimit, assignedIndex){
  var index = randomizer(maxLimit);

  while (assignedIndex.indexOf(index) >= 0){
    index = randomizer(maxLimit);
  }

  return index;
}
