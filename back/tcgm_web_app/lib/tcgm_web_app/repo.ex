defmodule TcgmWebApp.Repo do
  use Ecto.Repo,
    otp_app: :tcgm_web_app,
    adapter: Ecto.Adapters.Postgres
end
