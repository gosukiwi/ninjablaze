'use strict';

/**
 * Game mechanic things.
 */
var Mechanics = {

  // Functions to calculate jutsu type multiplier, either taijutsu, ninjutsu or
  // genjutsu
  // -------------------------------------------------------------------------
  taijutsuRatio: function (str, agi, int) {
    return str * 10 + agi * 7 + int * 3;
  },

  ninjutsuRatio: function (str, agi, int) {
    return agi * 10 + str * 6 + int * 4;
  },

  genjutsuRatio: function (str, agi, int) {
    return int * 10 + agi * 8 + int * 2;
  },

  ratio: function (user, type) {
    return this[type + 'Ratio'](user.str, user.agi, user.int);
  },

  // Calculate damage, we get the jutsu type ratios for both players and apply
  // the damage calculation formula which can be found in the docs.
  attack: function (attacker, defender, jutsu) {
    var attackerRatio = this.ratio(attacker, jutsu.type);
    var defenderRatio = this.ratio(defender, jutsu.type);
    var damage        = attackerRatio * jutsu.damage;
    var defended      = defenderRatio / (1000 + defenderRatio);

    // Effective damage dealt to defender
    return damage * (1 - defended);
  }

};

module.exports = Mechanics;
