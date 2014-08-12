# Damage Calculation
Each player has three stats:

 * Str: Mainly taijutsu damage, 
 * Agi: Mainly ninjutsu damage, the ability to attack first
 * Int: Mainly genjutsu damage

Players also have a primary chakra type, either Water, Fire, Earth, Wind or Electric.
When reaching lvl 30 you get another element, the same for lvl 60 and 90
respectively. Attacks with certain types always have bonus effect on the
primary chakra type, for example if you are water type you'll receive less
damage from fire jutsus and more damage from electric jutsus.

After each battle, both the winner and the loser get exp, the winner gets twice
as much as the loser.

Damage is calculated using "ratios", there are three ratios:

 * Taijutsu: Str * 10 + Agi * 7 + Int * 3
 * Ninjutsu: Agi * 10 + Str * 6 + Int * 4
 * Genjutsu: Agi * 8  + Str * 2 + Int * 10

We can now calculate damage using these ratios as follows:

    Damage with <X> type jutsu: <X> / 1000 + <X> - Where <X> is in [Taijutsu  |
    Ninjutsu | Genjutsu ].

So for example, if your jutsu does 320 ninjutsu damage and you have 33 str, 
20 agi and 10 int, defense and damage for ninjutsu calculates as follows:

    # When attacked with ninjutsu, this formula is applied to know how much
    # of the damage is defended.
    NINJUTSU = 200 + 138 + 40
    DEFENSE = 438 / 1000 + 438
            = 438 / 1438
            = 0.304 # 30~% damage defended
    # Now also apply elemental bonuses, given:
    TYPE_DIFERENCE(T1, T2) = [-1, 0, 1]
    # Type advantage varies by 5%
    TYPE_ADVANTAGE = (0.05 * TYPE_DIFFERENCE)
    # Apply TYPE_ADVANTAGE, which makes defense vary between -5% and +5%
    Defense = 0.3 * TYPE_ADVANTAGE
            = [0.25, 0.3, 0.35]

    # When attacking with ninjutsu damage is simply calculated as follows
    Damage  = (Ninjutsu: 200 + 198 + 40) * JUTSU_DAMAGE * (1 - enemy_ninjutsu_defense_ratio)
            = 438 * JUTSU_DAMAGE * (1 - enemy_ninjutsu_defense_ratio)

