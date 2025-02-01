defmodule TcgmWebAppWeb.Router do
  use TcgmWebAppWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug CORSPlug, origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  end

  scope "/api", TcgmWebAppWeb do
    pipe_through :api

    resources "/users", UserController, only: [:index, :show, :create, :update, :delete]

    resources "/games", GameController, only: [:index, :show, :create, :update, :delete]

    resources "/actions", ActionController, only: [:index, :show, :create, :update, :delete]

    resources "/cards", CardController, only: [:index, :show, :create, :update, :delete]
    get "/cards/game/:game_id", CardController, :get_cards_by_game_id

    resources "/cardTypes", CardTypeController, only: [:index, :show, :create, :update, :delete]
    get "/cardTypes/game/:game_id", CardTypeController, :get_cardTypes_by_game_id

    resources "/effects", EffectController, only: [:index, :show, :create, :update, :delete]
    get "/effects/game/:game_id", EffectController, :get_effects_by_game_id

    get "/hello", HelloController, :index
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
