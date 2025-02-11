defmodule TcgmWebAppWeb.Schemas do
  use PhoenixSwagger

  def swagger_definitions do
    %{
      ActionRequest: %{
        type: :object,
        properties: %{
          name: %{type: :string, description: "Name of the action"},
          description: %{type: :string, description: "Description of the action"}
        },
        required: [:name, :description]
      },
      CardRequest: %{
        type: :object,
        properties: %{
          name: %{type: :string, description: "Name of the card"},
          text: %{type: :string, description: "Text of the card"},
          image: %{type: :string, description: "Image of the card"},
          effect_ids: %{type: :array, items: %{type: :integer}, description: "IDs of the effects"},
          properties: %{type: :object, description: "Properties of the card"},
          game_id: %{type: :integer, description: "ID of the game"},
          card_type_id: %{type: :integer, description: "ID of the card type"},
        },
        required: [:name, :description, :effects, :properties, :game_id, :card_type_id]
      },
      GameRequest: %{
        type: :object,
        properties: %{
          name: %{type: :string, description: "Name of the game"},
          description: %{type: :string, description: "Description of the game"}
        },
        required: [:name, :description]
      },
      UserRequest: %{
        type: :object,
        properties: %{
          username: %{type: :string, description: "Username of the user"},
        },
        required: [:username]
      },
      CardTypeRequest: %{
        type: :object,
        properties: %{
          name: %{type: :string, description: "Name of the card type"},
          properties: %{type: :object, description: "Properties of the card type"},
          game_id: %{type: :integer, description: "ID of the game"}
        },
        required: [:name, :properties, :game_id]
      },
      EffectRequest: %{
        type: :object,
        properties: %{
          description: %{type: :string, description: "Description of the effect"},
          action_ids: %{type: :array, items: %{type: :integer}, description: "IDs of the actions"},
          game_id: %{type: :integer, description: "ID of the game"}
        },
        required: [:name, :description]
      },
      RoomRequest: %{
        type: :object,
        properties: %{
          room_id: %{type: :string, description: "Name of the room"},
          player_id: %{type: :string, description: "ID of the player"},
        },
        required: [:name, :description, :game_id]
      }
    }
  end
end
