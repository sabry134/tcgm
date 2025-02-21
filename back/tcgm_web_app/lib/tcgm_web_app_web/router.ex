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

    resources "/actions", ActionController, only: [:index, :show, :create, :update]
    delete "/actions/delete/:action_id", ActionController, :delete_action
    get "/actions/name/:name", ActionController, :get_action_by_name

    resources "/cards", CardController, only: [:index, :show, :create, :update]
    delete "/cards/delete/:card_id", CardController, :delete_card
    get "/cards/game/:game_id", CardController, :get_cards_by_game_id

    resources "/cardTypes", CardTypeController, only: [:index, :show, :create, :update]
    delete "/cardTypes/delete/:cardType_id", CardTypeController, :delete_cardType
    get "/cardTypes/game/:game_id", CardTypeController, :get_cardTypes_by_game_id

    resources "/effects", EffectController, only: [:index, :show, :create, :update]
    delete "/effects/delete/:effect_id", EffectController, :delete_effect
    get "/effects/game/:game_id", EffectController, :get_effects_by_game_id

    resources "/card_collections", CardCollectionController, only: [:index, :show, :create, :update]
    delete "/card_collections/delete/:card_collection_id", CardCollectionController, :delete_card_collection
    get "/card_collections/game/:game_id", CardCollectionController, :get_card_collections_by_game_id
    get "/card_collections/game/:game_id/type/:type", CardCollectionController, :get_card_collections_by_game_id_and_type

    post "/rooms", RoomController, :create
    get "/rooms/:room_id", RoomController, :state
    post "/rooms/:room_id/join", RoomController, :join

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
