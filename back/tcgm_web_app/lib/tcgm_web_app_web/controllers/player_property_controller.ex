defmodule TcgmWebAppWeb.PlayerPropertyController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.PlayerProperties.PlayerProperties
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/playerProperties")
    description("List all player properties")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    player_properties = PlayerProperties.list_player_properties()
    json(conn, player_properties)
  end

  swagger_path :show do
    get("/playerProperties/{id}")
    description("Get a player property by ID")
    parameter("id", :path, :integer, "player property ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "player property not found")
  end

  def show(conn, %{"id" => id}) do
    player_property = PlayerProperties.get_player_property!(id)
    json(conn, player_property)
  end

  swagger_path :create do
    post("/playerProperties")
    description("Create a new player property")
    parameter(:body, :body, Schema.ref(:PlayerPropertyRequest), "player property request payload", required: true)
    response(code(:created), "player property created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"playerProperty" => player_property_params}) do
    case PlayerProperties.create_player_property(player_property_params) do
      {:ok, player_property_params} ->
        conn
        |> put_status(:created)
        |> json(player_property_params)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :create_player_properties do
    post("/playerProperties/create")
    description("Create multiple player properties")
    parameter(:body, :body, Schema.ref(:PlayerPropertyRequest), "player property request payload", required: true)
    response(code(:created), "player properties created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create_player_properties(conn, %{"playerProperties" => player_property_params}) do
    results =
      Enum.map(player_property_params, fn property_params ->
        case PlayerProperties.create_player_property(property_params) do
          {:ok, player_property} -> {:ok, player_property}
          {:error, changeset} -> {:error, changeset}
        end
      end)

    if Enum.all?(results, fn result -> match?({:ok, _}, result) end) do
      created_properties = Enum.map(results, fn {:ok, property} -> property end)
      conn
      |> put_status(:created)
      |> json(created_properties)
    else
      errors = Enum.filter(results, fn result -> match?({:error, _}, result) end)
      conn
      |> put_status(:unprocessable_entity)
      |> json(errors)
    end
  end

  swagger_path :update do
    put("/playerProperties/{id}")
    description("Update a player property by ID")
    parameter("id", :path, :string, "Player property ID", required: true)
    parameter(:body, :body, Schema.ref(:PlayerPropertyRequest), "player property request payload", required: true)
    response(code(:ok), "player property updated")
    response(code(:not_found), "player property not found")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "playerProperty" => player_property_params}) do
    player_property = PlayerProperties.get_player_property!(id)

    case PlayerProperties.update_player_property(player_property, player_property_params) do
      {:ok, player_property} ->
        json(conn, player_property)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :delete do
    delete("/playerProperties/delete/{id}")
    description("Delete a player property by ID")
    parameter("id", :path, :integer, "Player property ID", required: true)
    response(code(:no_content), "Player Property deleted")
    response(code(:not_found), "Player property not found")
  end

  def delete_player_property(conn, %{"player_property_id" => id}) do
    player_property = PlayerProperties.get_player_property!(id)

    PlayerProperties.delete_player_property!(player_property)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_player_property_by_game_rule_id do
    get("/playerProperties/playerProperty/{game_rule_id}")
    description("Get player properties by game rule ID")
    parameter("game_rule_id", :path, :integer, "Game rule ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "player properties not found")
  end

  def get_player_properties_by_game_rule_id(conn, %{"game_rule_id" => game_rule_id}) do
    case PlayerProperties.get_player_properties_by_game_rule_id(game_rule_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{})
      player_properties ->
        json(conn, player_properties)
    end
  end
end
