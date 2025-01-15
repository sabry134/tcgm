defmodule TcgmWebApp.GreetingsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TcgmWebApp.Greetings` context.
  """

  @doc """
  Generate a hello.
  """
  def hello_fixture(attrs \\ %{}) do
    {:ok, hello} =
      attrs
      |> Enum.into(%{
        message: "some message"
      })
      |> TcgmWebApp.Greetings.create_hello()

    hello
  end
end
