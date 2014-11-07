'use strict';

/**
 * Game mechanic things.
 * Used to calculate damage and store formulas.
 */
var Mechanics = {

  // Functions to calculate jutsu type multiplier, either taijutsu, ninjutsu or
  // genjutsu. The idea is genjutsu > taijutsu > ninjutsu, but it's quite rough.
  //
  // Taijutsu scales best with STR, and decent with AGI
  // Ninjutsu scales best with AGI, and decent with STR
  // Genjutsu scales best with INT, and decent with AGI
  // -------------------------------------------------------------------------
  taijutsuRatio: function (str, agi, int) {
    return str * 1 + agi * 0.7 + int * 0.3;
  },

  ninjutsuRatio: function (str, agi, int) {
    return agi * 1 + str * 0.6 + int * 0.4;
  },

  genjutsuRatio: function (str, agi, int) {
    return int * 1 + agi * 0.8 + int * 0.2;
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
    // TODO: Element?
    var defended      = defenderRatio / (100 + defenderRatio);

    // Effective damage dealt to defender, truncate to integer value
    return parseInt(damage * (1 - defended), 10);
  }

};

module.exports = Mechanics;
