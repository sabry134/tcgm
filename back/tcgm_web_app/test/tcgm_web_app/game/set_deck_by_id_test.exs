defmodule TcgmWebApp.Game.SetDeckByIdTest do
  use ExUnit.Case, async: true
  use TcgmWebAppWeb.ConnCase
  alias TcgmWebApp.Game.GameServer

  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Accounts.User
  alias TcgmWebApp.CardCollections.CardCollection
  alias TcgmWebApp.CardCollectionCards.CardCollectionCard
  alias TcgmWebApp.Cards.Card
  alias TcgmWebApp.CardTypeProperties.CardTypeProperty
  alias TcgmWebApp.CardProperties.CardProperty
  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Repo

  setup do
    room_id = "test_room"
    {:ok, pid} = GameServer.start_link(room_id)

    :ok = Ecto.Adapters.SQL.Sandbox.allow(Repo, self(), pid)

    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    user = %User{}
    |> User.changeset(%{ username: "username"})
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", properties: ["property1", "property2"], game_id: game.id })
    |> Repo.insert!()

    action = %Action{}
    |> Action.changeset(%{ name: "Test action", description: "Test description", game_id: game.id })
    |> Repo.insert!()

    effect = %Effect{}
    |> Effect.changeset(%{ description: "Test description", action_ids: [action.id], game_id: game.id })
    |> Repo.insert!()

    card = %Card{}
    |> Card.changeset(%{ name: "Test card", text: "Test text", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card2 = %Card{}
    |> Card.changeset(%{ name: "Test card 2", text: "Test text 2", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card3 = %Card{}
    |> Card.changeset(%{ name: "Test card 3", text: "Test text 3", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    cardTypeProperty = %CardTypeProperty{}
    |> CardTypeProperty.changeset(%{ property_name: "property1", cardtype_id: cardType.id, type: "text", value: "test", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, image: "image", image_width: 100, image_height: 100, image_position_x: 0, image_position_y: 0, image_rotation: 0, image_scale_x: 1, image_scale_y: 1, image_opacity: 100 })
    |> Repo.insert!()

    cardTypeProperty2 = %CardTypeProperty{}
    |> CardTypeProperty.changeset(%{ property_name: "property2", cardtype_id: cardType.id, type: "number", value: "test", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, image: "image", image_width: 100, image_height: 100, image_position_x: 0, image_position_y: 0, image_rotation: 0, image_scale_x: 1, image_scale_y: 1, image_opacity: 100 })
    |> Repo.insert!()

    %CardProperty{}
    |> CardProperty.changeset(%{ card_id: card.id, cardtype_property_id: cardTypeProperty.id, value_string: "test", value_number: 1, value_boolean: true })
    |> Repo.insert!()

    %CardProperty{}
    |> CardProperty.changeset(%{ card_id: card2.id, cardtype_property_id: cardTypeProperty.id, value_string: "test", value_number: 1, value_boolean: true })
    |> Repo.insert!()

    %CardProperty{}
    |> CardProperty.changeset(%{ card_id: card3.id, cardtype_property_id: cardTypeProperty.id, value_string: "test", value_number: 1, value_boolean: true })
    |> Repo.insert!()

    %CardProperty{}
    |> CardProperty.changeset(%{ card_id: card3.id, cardtype_property_id: cardTypeProperty2.id, value_string: "test", value_number: 1, value_boolean: true })
    |> Repo.insert!()

    card_collection = %CardCollection{}
    |> CardCollection.changeset(%{ name: "test", quantity: 1, game_id: game.id, user_id: user.id, type: "Test_type" })
    |> Repo.insert!()

    %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card.id, quantity: 1, group: "deck" })
    |> Repo.insert!()

    %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card2.id, quantity: 1, group: "deck" })
    |> Repo.insert!()

    %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card3.id, quantity: 1, group: "caster" })
    |> Repo.insert!()

    {:ok, room_id: room_id, card_collection: card_collection}
  end

  test "players can set their deck by id", %{room_id: room_id, card_collection: card_collection} do
    GameServer.join_room(room_id, "player1")

    initial_state = GameServer.get_state(room_id)

    assert length(initial_state.players["player1"]["deck"]) == 0
    assert length(initial_state.players["player1"]["caster"]) == 0

    :ok = GameServer.set_deck_by_id(room_id, "player1", card_collection.id)

    updated_state = GameServer.get_state(room_id)
    
    assert length(updated_state.players["player1"]["deck"]) == 2
    assert length(updated_state.players["player1"]["caster"]) == 1
  end

end
