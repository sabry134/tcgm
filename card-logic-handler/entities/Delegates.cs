namespace Entities.Delegates {
    public delegate void Effect(Entity target, params object[] args);
    public delegate bool Condition(Entity target, params object[] args);
    public delegate bool Cost(Entity target, params object[] args);
}