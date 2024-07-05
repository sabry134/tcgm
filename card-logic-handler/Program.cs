namespace card_logic_handler;
using Engine;
using Entities;
using Entities.Utils;
using Entities.Delegates;
using ConfigLoader;

class Program
{
    static void Main(string[] args)
    {
        var engine = new GameEngine();
        
        var cards = CardLoader.LoadCards("../card-logic-creator/cards.json");

        int hp = (int)engine.Player.GetAttribute("Health");
        Console.WriteLine($"Player starting health is : {hp}");

        foreach (var card in cards) {
            string name = card.Name;
            Console.WriteLine($"About to play card with name : {name}");
            card.Play(engine.Player);
        }

        Console.WriteLine("Player's health: " + engine.Player.GetAttribute("Health"));
    }
}
