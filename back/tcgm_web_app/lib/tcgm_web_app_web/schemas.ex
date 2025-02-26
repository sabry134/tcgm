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
      },
      CardCollectionRequest: %{
        type: :object,
        properties: %{
          name: %{type: :string, description: "Name of the card collection"},
          quantity: %{type: :integer, description: "Quantity of the card"},
          game_id: %{type: :integer, description: "ID of the game"},
          type: %{type: :string, description: "Type of the card"}
        },
        required: [:quantity, :game_id, :type]
      },
      CardTypeProperties: %{
        type: :object,
        properties: %{
          property_name: %{type: :string, description: "Name of the property"},
          cardtype_id: %{type: :integer, description: "ID of the card type"},
          type: %{type: :string, description: "Type of the property"},
          font: %{type: :string, description: "Font of the property"},
          font_size: %{type: :integer, description: "Font size of the property"},
          font_color: %{type: :string, description: "Font color of the property"},
          position_x: %{type: :integer, description: "Position X of the property"},
          position_y: %{type: :integer, description: "Position Y of the property"},
          rotation: %{type: :integer, description: "Rotation of the property"},
          scale_x: %{type: :integer, description: "Scale X of the property"},
          scale_y: %{type: :integer, description: "Scale Y of the property"},
          image: %{type: :string, description: "Image of the property"},
          image_width: %{type: :integer, description: "Image width of the property"},
          image_height: %{type: :integer, description: "Image height of the property"},
          image_position_x: %{type: :integer, description: "Image position X of the property"},
          image_position_y: %{type: :integer, description: "Image position Y of the property"},
          image_rotation: %{type: :integer, description: "Image rotation of the property"},
          image_scale_x: %{type: :integer, description: "Image scale X of the property"},
          image_scale_y: %{type: :integer, description: "Image scale Y of the property"},
          image_opacity: %{type: :integer, description: "Image opacity of the property"},
        },
        required: [:property_name, :cardtype_id, :type, :position_x, :position_y, :rotation, :scale_x, :scale_y]
      }
    }
  end
end
