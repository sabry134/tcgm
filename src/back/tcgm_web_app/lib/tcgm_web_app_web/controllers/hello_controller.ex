defmodule TcgmWebAppWeb.HelloController do
  use TcgmWebAppWeb, :controller

  # The index action for the hello route
  def index(conn, _params) do
    json(conn, %{message: "Hello, World!"})
  end
end
