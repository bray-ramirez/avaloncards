if (Meteor.isClient){

  Template.lobbyTemplate.events({
    'click .js-select-merlin': function(event, template){
      var isChecked = event.target.checked;

      Meteor.call('setMerlinGameMode', Session.get('gameId'), isChecked);

      if (!isChecked){
        Meteor.call('setPercivalGameMode', Session.get('gameId'), false);
        Meteor.call('setMordredGameMode', Session.get('gameId'), false);
        Meteor.call('setOberonGameMode', Session.get('gameId'), false);
      }
    },
    'click .js-select-percival': function(event, template){
      if (!isMerlinChecked(template)) return false;

      if (!addCharactersValid(template,
        {sevenPlayer: '.js-select-mordred',
        tenPlayer: '.js-select-oberon',
        character: 'Morgana'})){

        return false;
      }

      Meteor.call('setPercivalGameMode', Session.get('gameId'), event.target.checked);
    },
    'click .js-select-mordred': function(event, template){
      if (!isMerlinChecked(template)) return false;

      if (!addCharactersValid(template,
        {sevenPlayer: '.js-select-percival',
        tenPlayer: '.js-select-oberon',
        character: 'Mordred'})){

        return false;
      }

      Meteor.call('setMordredGameMode', Session.get('gameId'), event.target.checked);
    },
    'click .js-select-oberon': function(event, template){
      var noOfPlayers = Players.find({gameId: Session.get('gameId')}).count();

      if (!addCharactersValid(template,
        {sevenPlayer: '.js-select-percival',
        tenPlayer: '.js-select-mordred',
        character: 'Oberon'})){

        return false;
      }

      Meteor.call('setOberonGameMode', Session.get('gameId'), event.target.checked);
    },
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


var isMerlinChecked = function(template){
  if (template.find('.js-select-merlin').checked) return true;

  FlashMessages.sendError('Merlin must be selected.', {hideDelay: 800});
  return false;
}


var addCharactersValid = function(template, options){
  var noOfPlayers = Players.find({gameId: Session.get('gameId')}).count();

  if ((noOfPlayers < 7 && template.find(options.sevenPlayer).checked) ||
    (noOfPlayers < 10 && template.find(options.tenPlayer).checked)){

    FlashMessages.sendError(
      'Few players to play ' + options.character + '.',
      {hideDelay: 800}
    );

    return false;
  }


  return true;
}
