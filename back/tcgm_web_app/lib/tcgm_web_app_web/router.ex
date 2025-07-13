defmodule TcgmWebAppWeb.Router do
  use TcgmWebAppWeb, :router

  def cors_plug(conn, _opts) do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "authorization, content-type, accept")
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :cors_plug
  end

  scope "/api", TcgmWebAppWeb do
    pipe_through :api

    resources "/users", UserController, only: [:index, :show, :create, :update]
    delete "/users/delete/:user_id", UserController, :delete_user
    post "/users/login", UserController, :login

    resources "/games", GameController, only: [:index, :show, :create, :update]
    delete "/games/delete/:game_id", GameController, :delete_game
    get "/games/name/:name", GameController, :get_game_by_name
    post "/games/groups", GameController, :create_card_collection_group
    get "/games/:game_id/groups", GameController, :get_card_collection_groups_by_game_id
    get "/games/:game_id/groups/:collection_type", GameController, :get_card_collection_group_by_game_id_and_collection_type
    get "/games/role/:role_name/user/:user_id", GameController, :get_games_by_role_and_user_id
    get "/games/:game_id/user/:user_id/roles", GameController, :get_user_roles_for_game
    post "/games/:game_id/user/:user_id/role", GameController, :grant_role_to_user

    resources "/actions", ActionController, only: [:index, :show, :create, :update]
    delete "/actions/delete/:action_id", ActionController, :delete_action
    get "/actions/name/:name", ActionController, :get_action_by_name

    resources "/cards", CardController, only: [:index, :show, :create, :update]
    delete "/cards/delete/:card_id", CardController, :delete_card
    get "/cards/game/:game_id", CardController, :get_cards_by_game_id
    post "/cards/with_properties", CardController, :create_card_with_properties
    get "/cards/game/:game_id/with_properties", CardController, :get_cards_with_properties_by_game_id
    get "/cards/:card_id/cardtype", CardController, :get_card_cardtype

    get "/cardTypes/templates", CardTypeController, :get_card_type_templates
    resources "/cardTypes", CardTypeController, only: [:index, :show, :create, :update]
    delete "/cardTypes/delete/:cardType_id", CardTypeController, :delete_cardType
    get "/cardTypes/game/:game_id", CardTypeController, :get_cardTypes_by_game_id
    post "/cardTypes/with_properties", CardTypeController, :create_cardType_with_properties

    resources "/effects", EffectController, only: [:index, :show, :create, :update]
    delete "/effects/delete/:effect_id", EffectController, :delete_effect
    get "/effects/game/:game_id", EffectController, :get_effects_by_game_id

    resources "/cardTypeProperties", CardTypePropertyController, only: [:index, :show, :create, :update]
    delete "/cardTypeProperties/delete/:cardTypeProperty_id", CardTypePropertyController, :delete_cardType_property
    get "/cardTypeProperties/cardType/:cardType_id", CardTypePropertyController, :get_card_type_properties_by_card_type_id
    get "/cardTypeProperties/cardType/:cardType_id/property/:property_name", CardTypePropertyController, :get_card_type_properties_by_card_type_id_and_property_name

    resources "/cardProperties", CardPropertyController, only: [:index, :show, :create, :update]
    delete "/cardProperties/delete/:cardProperty_id", CardPropertyController, :delete_card_property
    get "/cardProperties/card/:card_id", CardPropertyController, :get_card_properties_by_card_id
    get "/cardProperties/card/:card_id/property/:cardtype_property_id", CardPropertyController, :get_card_properties_by_card_id_and_cardtype_property_id

    get "/card_collections/templates", CardCollectionController, :get_card_collection_templates
    resources "/card_collections", CardCollectionController, only: [:index, :show, :create, :update]
    delete "/card_collections/delete/:card_collection_id", CardCollectionController, :delete_card_collection
    get "/card_collections/:card_collection_id/cards", CardCollectionController, :get_cards_in_card_collection
    put "/card_collections/:card_collection_id/cards", CardCollectionController, :update_card_collection
    get "/card_collections/user/:user_id", CardCollectionController, :get_card_collections_by_user_id
    get "/card_collections/user/:user_id/game/:game_id", CardCollectionController, :get_card_collections_by_user_id_and_game_id
    get "/card_collections/active/:game_id/:type", CardCollectionController, :get_active_card_collection_by_game_id_and_type

    get "/boards/templates", BoardController, :get_board_templates
    resources "/boards", BoardController, only: [:index, :show, :create, :update]
    delete "/boards/delete/:board_id", BoardController, :delete_board
    get "/boards/game/:game_id", BoardController, :get_board_by_game_id
    post "/boards/with_zones", BoardController, :create_board_with_zones
    get "/boards/with_zones/:board_id", BoardController, :get_board_with_zones
    put "/boards/with_zones/:board_id", BoardController, :update_board_with_zones
    get "/boards/:board_id/zones", BoardController, :get_board_zones
    delete "/boards/zones/:zone_id", BoardController, :delete_board_zone

    post "/rooms", RoomController, :create
    get "/rooms/:room_id", RoomController, :state
    post "/rooms/:room_id/join", RoomController, :join
    post "/rooms/leave", RoomController, :leave

    resources "/rules", RuleController, only: [:index, :show, :create, :update]
    delete "/rules/delete/:rule_id", RuleController, :delete_rule
    get "/rules/rule/:game_rule_id", RuleController, :get_rules_by_game_rule_id

    resources "/playerProperties", PlayerPropertyController, only: [:index, :show, :create, :update]
    delete "/playerProperties/delete/:player_property_id", PlayerPropertyController, :delete_player_property
    get "/playerProperties/playerProperty/:game_rule_id", PlayerPropertyController, :get_player_properties_by_game_rule_id
    post "/playerProperties/create", PlayerPropertyController, :create_player_properties

    get "/gameRules/templates", GameRuleController, :get_game_rule_templates
    resources "/gameRules", GameRuleController, only: [:index, :show, :create, :update]
    delete "/gameRules/delete/:game_rule_id", GameRuleController, :delete_game_rule
    get "/gameRules/gameRule/:game_id", GameRuleController, :get_game_rules_by_game_id

    get "/hello", HelloController, :index
  end

  def swagger_info do
    %{
      schemes: ["http", "https"],
      info: %{
        version: "1.0",
        title: "TCGM Web API",
        description: "API Documentation for TCGM v1",
      },
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [
        %{name: "users", description: "Operations about users"},
        %{name: "games", description: "Operations about games"},
        %{name: "actions", description: "Operations about actions"},
        %{name: "cards", description: "Operations about cards"},
        %{name: "cardTypes", description: "Operations about cardTypes"},
        %{name: "effects", description: "Operations about effects"},
        %{name: "rooms", description: "Operations about rooms"},
      ]
    }
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:tcgm_web_app, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: TcgmWebAppWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
