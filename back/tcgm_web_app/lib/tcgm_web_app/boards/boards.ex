defmodule TcgmWebApp.Boards.Boards do
  alias TcgmWebApp.Boards.Board
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

  @moduledoc """
    This module is responsible for handling boards.
  """

  @doc """
    Creates a board with the given attributes.
  """
  def create_board(attrs) do
    %Board{}
    |> Board.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a board with the given id.
  """
  def get_board!(id) do
    Repo.get!(Board, id)
  end

  @doc """
    Retrieves all boards.
  """
  def list_boards do
    Repo.all(Board)
  end

  @doc """
    Deletes a board.
  """
  def delete_board!(%Board{} = board) do
    Repo.delete!(board)
  end

  @doc """
    Updates a board with the given attributes.
  """
  def update_board(%Board{} = board, attrs) do
    board
    |> Board.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves board by game id.
  """
  def get_board_by_game_id(game_id) do
    from(b in Board,
      where: b.game_id == ^game_id
    )
    |> Repo.one()
  end

  @doc """
    Retrieves boards with public template true.
  """
  def get_board_templates do
    from(b in Board,
      where: b.public_template == true
    )
    |> Repo.all()
  end
end
