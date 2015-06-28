if (Meteor.isClient){

  Template.inGameTemplate.helpers({
    player: function(){
      // Meteor.subscribe('playersByGameId', Session.get('gameId'));
      return Players.findOne({_id: Session.get('playerId')});
    },
    evil: function(){
      // Meteor.subscribe('playersByGameId', Session.get('gameId'));
      var player = Players.findOne({_id: Session.get('playerId')});

      if (player.evil) return 'Evil';

      return 'Good';
    },
    hasAbility: function(){
      var player = Players.findOne({_id: Session.get('playerId')});

      return player.ability !== null;
    }
  });


  Template.inGamePlayerListTemplate.helpers({
    players: function(){
      // Meteor.subscribe('playersByGameId', Session.get('gameId'));
      return Players.find({gameId: Session.get('gameId')});
    }
  });


  Template.inGamePlayerTemplate.helpers({
    isCurrent: function(){
      return this._id === Session.get('playerId');
    },
    evil: function(){
      var player = Players.findOne({_id: this._id});
      if (player.evil) return 'Evil';

      return 'Good';
    },
    characterName: function(){
      var player = Players.findOne({_id: Session.get('playerId')});

      if ((player.evil && this.visibleToEvil && !this.isOberon) || (player.isMerlin && this.visibleToMerlin)){
        return 'Minion of Mordred';
      }

      if (player.isPercival && this.visibleToPercival) return 'Possible Merlin';

      return '';
    }
  });

}
