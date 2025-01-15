import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :tcgm_web_app, TcgmWebApp.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "tcgm_web_app_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :tcgm_web_app, TcgmWebAppWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "aMHoidrw42v8L94zpQUC/NHb64XKFKPfqaPxMywKqvK/eHXoXUfb+v+ccXPHXeoB",
  server: false

# In test we don't send emails.
config :tcgm_web_app, TcgmWebApp.Mailer, adapter: Swoosh.Adapters.Test

# Disable swoosh api client as it is only required for production adapters.
config :swoosh, :api_client, false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
