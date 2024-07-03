
namespace Entities {
    public class Entity {
        public Dictionary<string, object> Attributes { get; private set; } = new Dictionary<string, object>();

        public void SetAttribute(string name, object value) {
            if (Attributes.ContainsKey(name)) {
                Attributes[name] = value;
            } else {
                Attributes.Add(name, value);
            }
        }

        public object GetAttribute(string name) {
            return Attributes.ContainsKey(name) ? Attributes[name] : 0;
        }

        public void ModifyNumberAttribute(string name, int value) {
            if (Attributes.ContainsKey(name) && Attributes[name] is int) {
                int currentValue = (int)Attributes[name];
                Attributes[name] = currentValue + value;
            }
            else {
                // Handle the case where the attribute is not found or not an integer
                throw new InvalidOperationException("The attribute is not an integer or does not exist.");
            }
        }
    }
}
