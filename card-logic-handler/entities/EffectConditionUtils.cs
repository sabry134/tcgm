using System.Text.Json;
using Entities;
using Entities.Delegates;

namespace Entities.Utils {

    public static class EffectConditionUtils {

        // Card Effect
        public static void DealDamagePlayer(Entity target, params object[] args) {
            if (target is Player player) {
                int damage = (int)args[0];
                player.ModifyNumberAttribute("Health", -damage);
                Console.WriteLine($"Dealt {damage} damage to player");
            } else {
                Console.WriteLine("Invalid target !");
            }
        }

        public static void HealPlayer(Entity target, params object[] args) {
            if (target is Player player) {
                int amount = (int)args[0];
                player.ModifyNumberAttribute("Health", amount);
                Console.WriteLine($"Healed player {amount} health");
            } else {
                Console.WriteLine("Invalid target !");
            }
        }

        public static void DrawCards(Entity target, params object[] args) {
            if (target is Player player) {
                int amount = (int)args[0];
                if (player.Deck.CountCards() > amount) {
                    for (int i = 0; i < amount; i++) {
                        player.DrawCard();
                    }
                } else {
                    Console.WriteLine("Not enough cards in deck");
                }
            } else {
                Console.WriteLine("Invalid target !");
            }
        }

        // Effect Conditions
        public static bool TrueCondition(Entity entity, params object[] args) {
            return true;
        }

        public static bool PlayerHealthBelowThreshold(Entity entity, params object[] args) {
            if (entity is Player player) {
                int threshold = args.Length > 0 && args[0] is int ? (int)args[0] : 20;
                if ((int)player.GetAttribute("Health") < threshold) {
                    return true;
                } else {
                    Console.WriteLine("Couldn't fulfill health requirement");
                }
            } else {
                Console.WriteLine("Invalid target !");
            }
            return false;
        }

        // Cost
        public static bool NoCost(Entity entity, params object[] args) {
            return true;
        }

        public static bool DiscardCost(Entity entity, params object[] args) {
            if (entity is Player player) {
                int amount = (int)args[0];
                if (player.Hand.CountCards() >= amount) {
                    for (int i = 0; i < amount; i++) {
                        player.Hand.DiscardRandom(player.Discard);
                    }
                    return true;
                } else {
                    Console.WriteLine("Not enough cards in hand !");
                    return false;
                }
            } else {
                Console.WriteLine("Invalid target !");
                return false;
            }
        }

        public static bool PlayerLifeCost(Entity entity, params object[] args) {
            if (entity is Player player) {
                int amount = (int)args[0];
                if ((int)player.GetAttribute("Health") > amount) {
                    player.ModifyNumberAttribute("Health", amount);
                    return true;
                } else {
                    Console.WriteLine("Not enough health to pay !");
                    return false;
                }
            } else {
                Console.WriteLine("Invalid target !");
                return false;
            }
        }

        // Getters
        public static Effect GetEffectByName(string name) {
            return name switch {
                "DealDamage" => DealDamagePlayer,
                "Heal" => HealPlayer,
                "DrawCards" => DrawCards,
                _ => throw new ArgumentException($"Effect '{name}' not found.")
            };
        }

        public static Condition GetConditionByName(string name) {
            return name switch {
                "TrueCondition" => TrueCondition,
                "PlayerHealthBelowThreshold" => PlayerHealthBelowThreshold,
                _ => throw new ArgumentException($"Condition '{name}' not found")
            };
        }

        public static Cost GetCostByName(string name) {
            return name switch {
                "NoCost" => NoCost,
                "DiscardCost" => DiscardCost,
                "LifeCost" => PlayerLifeCost,
                _ => throw new ArgumentException($"Cost '{name}' not found")
            };
        }
    }
}
