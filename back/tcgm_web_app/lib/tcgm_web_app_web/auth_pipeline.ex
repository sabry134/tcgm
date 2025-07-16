defmodule TcgmWebAppWeb.AuthPipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :tcgm_web_app,
    module: TcgmWebApp.Guardian,
    error_handler: TcgmWebAppWeb.AuthErrorHandler

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Plug.LoadResource
end
