defmodule TcgmWebAppWeb.ChannelCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      use Phoenix.ChannelTest
      @endpoint TcgmWebAppWeb.Endpoint
    end
  end
end
