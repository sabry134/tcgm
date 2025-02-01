defmodule TcgmWebApp.HealthFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TcgmWebApp.Health` context.
  """

  @doc """
  Generate a check.
  """
  def check_fixture(attrs \\ %{}) do
    {:ok, check} =
      attrs
      |> Enum.into(%{
        status: "some status"
      })
      |> TcgmWebApp.Health.create_check()

    check
  end
end
