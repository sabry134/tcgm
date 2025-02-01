defmodule TcgWebApp.Gameplay.Player do
  defstruct [:id, :hand, :deck, :field, :graveyard, :caster_zones]

  # Initialize a new player
  def new(id, deck \\ []) do
    %__MODULE__{
      id: id,
      hand: [],
      deck: deck,
      field: [],
      graveyard: [],
      caster_zones: []
    }
  end
end
