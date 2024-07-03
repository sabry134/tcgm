using Entities.Utils;
using Entities.Delegates;

namespace Entities {
    public class EffectConditionWithArgs {
        public Effect Effect { get; set; }
        public Condition Condition { get; set; }
        public Cost Cost { get; set; }
        public object[] EffectArgs { get; set; }
        public object[] ConditionArgs { get; set; }
        public object[] CostArgs { get; set; }

        public EffectConditionWithArgs(Effect effect, Condition condition, Cost cost,
                object[] effectArgs, object[] conditionArgs, object[] costArgs) {
            Effect = effect;
            Condition = condition;
            Cost = cost;
            EffectArgs = effectArgs;
            ConditionArgs = conditionArgs;
            CostArgs = costArgs;
        }
    }
}