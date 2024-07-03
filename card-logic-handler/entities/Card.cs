using Entities;
using Entities.Utils;
using Entities.Delegates;

namespace Entities {
    public class Card : Entity {
        public string Name { get; set; }
        public List<EffectConditionWithArgs> EffectsWithConditions { get; private set; } = new List<EffectConditionWithArgs>();

        public Card(string name, Dictionary<string, object> attributes, List<EffectConditionWithArgs> effectsWithConditions) {
            Name = name;
            foreach(KeyValuePair<string, object> attribute in attributes) {
                SetAttribute(attribute.Key, attribute.Value);
            }
            EffectsWithConditions = effectsWithConditions;
        }

        public void Play(Entity target, params object[] args) {
            foreach (var item in EffectsWithConditions) {
                if (item.Condition(target, item.ConditionArgs) && item.Cost(target, item.CostArgs)) {
                    item.Effect?.Invoke(target, item.EffectArgs);
                }
            }
        }
    }
}