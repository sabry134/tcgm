defmodule TcgmWebApp.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      TcgmWebAppWeb.Telemetry,
      TcgmWebApp.Repo,
      {DNSCluster, query: Application.get_env(:tcgm_web_app, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: TcgmWebApp.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: TcgmWebApp.Finch},
      # Start a worker by calling: TcgmWebApp.Worker.start_link(arg)
      # {TcgmWebApp.Worker, arg},
      # Start to serve requests, typically the last entry
      TcgmWebAppWeb.Endpoint,

      {Registry, keys: :unique, name: TcgmWebApp.Rooms.RoomRegistry},
      {DynamicSupervisor, strategy: :one_for_one, name: TcgmWebApp.Rooms.RoomSupervisor}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TcgmWebApp.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    TcgmWebAppWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
