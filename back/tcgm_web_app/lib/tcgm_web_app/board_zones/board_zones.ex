defmodule TcgmWebApp.BoardZones.BoardZones do
  @moduledoc """
  The BoardZones context.
  """

  import Ecto.Query, warn: false
  alias TcgmWebApp.Repo

  alias TcgmWebApp.BoardZones.BoardZone

  @doc """
  Returns the list of board_zones.

  ## Examples

      iex> list_board_zones()
      [%BoardZone{}, ...]

  """
  def list_board_zones do
    Repo.all(BoardZone)
  end

  @doc """
  Gets a single board_zone.

  Raises `Ecto.NoResultsError` if the Board zone does not exist.

  ## Examples

      iex> get_board_zone!(123)
      %BoardZone{}

      iex> get_board_zone!(456)
      ** (Ecto.NoResultsError)

  """
  def get_board_zone!(id), do: Repo.get!(BoardZone, id)

  @doc"""
  Gets a single board_zone by id.
  Returns nil if not found.
  ## Examples

      iex> get_board_zone(123)
      %BoardZone{}

      iex> get_board_zone(456)
      nil
  """

  def get_board_zone(id) do
    Repo.get(BoardZone, id)
  end

  @doc """
  Creates a board_zone.

  ## Examples

      iex> create_board_zone(%{field: value})
      {:ok, %BoardZone{}}

      iex> create_board_zone(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_board_zone(attrs \\ %{}) do
    %BoardZone{}
    |> BoardZone.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a board_zone.

  ## Examples

      iex> update_board_zone(board_zone, %{field: new_value})
      {:ok, %BoardZone{}}

      iex> update_board_zone(board_zone, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_board_zone(%BoardZone{} = board_zone, attrs) do
    board_zone
    |> BoardZone.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a board_zone.

  ## Examples

      iex> delete_board_zone(board_zone)
      {:ok, %BoardZone{}}

      iex> delete_board_zone(board_zone)
      {:error, %Ecto.Changeset{}}

  """
  def delete_board_zone(%BoardZone{} = board_zone) do
    Repo.delete(board_zone)
  end

  @doc """
    Retrieves all board zones for a given board.
  """
  def get_board_zones_by_board_id(board_id) do
    from(bz in BoardZone,
      where: bz.board_id == ^board_id
    )
    |> Repo.all()
  end
end
