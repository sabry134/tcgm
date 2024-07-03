using System.IO;
using System.Text.Json;
using Entities;
using Entities.Delegates;
using Entities.Utils;

namespace ConfigLoader {

    public class CardConfiguration {
        public string Name { get; set; } = "";
        public Dictionary<string, object> Attributes { get; set; } = new Dictionary<string, object>();
        public List<EffectConditionConfiguration> EffectsWithConditions { get; set; } = new List<EffectConditionConfiguration>();
    }

    public class EffectConditionConfiguration {
        public string EffectName { get; set; } = "";
        public string ConditionName { get; set; } = "";
        public string CostName { get; set; } = "";
        public object[] EffectArgs { get; set; } = {};
        public object[] ConditionArgs { get; set; } = {};
        public object[] CostArgs { get; set; } = {};
    }

    public class CardLoaderException : System.Exception
    {
        public CardLoaderException() { }
        public CardLoaderException(string message) : base(message) { }
        public CardLoaderException(string message, System.Exception inner) : base(message, inner) { }
    }

    public class CardLoader {
        public static List<Card> LoadCards(string filePath) {
            var json = File.ReadAllText(filePath);
            var cardConfigurations = JsonSerializer.Deserialize<List<CardConfiguration>>(json);

            var cards = new List<Card>();

            if (cardConfigurations == null) {
                throw new CardLoaderException("Card configuration not properly loaded");
            }

            foreach (var cardConfig in cardConfigurations) {
                var effectsWithConditions = new List<EffectConditionWithArgs>();
                string cardName = cardConfig.Name;

                if (cardConfig == null) {
                    throw new CardLoaderException("Card configuration not properly loaded");
                }

                foreach (var ec in cardConfig.EffectsWithConditions) {
                    var effect = EffectConditionUtils.GetEffectByName(ec.EffectName);
                    var condition = EffectConditionUtils.GetConditionByName(ec.ConditionName);
                    var cost = EffectConditionUtils.GetCostByName(ec.CostName);
                    object[] effArgs = getCleanArgsValues(ec.EffectArgs);
                    object[] conArgs = getCleanArgsValues(ec.ConditionArgs);
                    object[] cosArgs = getCleanArgsValues(ec.CostArgs);
                    effectsWithConditions.Add(new EffectConditionWithArgs(effect, condition, cost, effArgs, conArgs, cosArgs));
                }

                var card = new Card(cardConfig.Name, cardConfig.Attributes, effectsWithConditions);
                cards.Add(card);
            }

            return cards;
        }

        private static object[] getCleanArgsValues(object[] args) {
            int size = args.Length;
            object[] cleanArgs = new object[size];
            for (int i = 0; i < size; i++) {
                object arg = args[i];
                if (arg is JsonElement jsonElement && jsonElement.ValueKind == JsonValueKind.Number) {
                    int value = jsonElement.GetInt32();
                    cleanArgs[i] = value;
                } else if (arg is int argInt) {
                    cleanArgs[i] = argInt;
                }
            }

            return cleanArgs;
        }
    }
}