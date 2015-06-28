(function(){

  noOfMinions = {
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 4
  };


  roles = {
    0: {
      characterName: 'Loyal Servant of Arthur',
      evil: false
    },
    1: {
      characterName: 'Minion of Mordred',
      evil: true,
      visibleToMerlin: true,
      visibleToEvil: true
    },
    2: {
      characterName: 'Merlin',
      evil: false,
      ability: 'Knows Evil, must remain hidden',
      visibleToPercival: true,
      isMerlin: true
    },
    3: {
      characterName: 'Percival',
      evil: false,
      ability: 'Knows Merlin',
      isPercival: true
    },
    4: {
      characterName: 'Assassin',
      evil: true,
      ability: 'Can assassinate Merlin',
      visibleToMerlin: true,
      visibleToEvil: true
    },
    5: {
      characterName: 'Morgana',
      evil: true,
      ability: 'Appears as Merlin',
      visibleToMerlin: true,
      visibleToEvil: true,
      visibleToPercival: true
    },
    6: {
      characterName: 'Mordred',
      evil: true,
      ability: 'Unknown to Merlin',
      visibleToMerlin: false,
      visibleToEvil: true
    },
    7: {
      characterName: 'Oberon',
      evil: true,
      ability: 'Unknown to Evil',
      visibleToMerlin: true,
      visibleToEvil: false,
      isOberon: true
    }
  }

})();
