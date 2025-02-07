defmodule TcgmWebAppWeb.UserController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.Accounts
  alias TcgmWebAppWeb.Helpers
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/users")
    description("List all users")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    users = Accounts.list_users()
    json(conn, users)
  end

  swagger_path :show do
    get("/users/{id}")
    description("Get a user by ID")
    parameter("id", :path, :integer, "User ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "User not found")
  end

  def show(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)
    json(conn, user)
  end

  swagger_path :create do
    post("/users")
    description("Create a new user")
    parameter(:body, :body, Schema.ref(:UserRequest), "User request payload", required: true)
    response(code(:created), "User created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"user" => user_params}) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> json(user)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: Helpers.translate_errors(changeset)})
    end
  end

  swagger_path :update do
    put("/users/{id}")
    description("Update a user by ID")
    parameter("id", :path, :integer, "User ID", required: true)
    parameter(:body, :body, Schema.ref(:UserRequest), "User request payload", required: true)
    response(code(:ok), "User updated")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Accounts.get_user!(id)
    case Accounts.update_user(user, user_params) do
      {:ok, user} ->
        json(conn, user)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: Helpers.translate_errors(changeset)})
    end
  end

  swagger_path :delete do
    delete("/users/{id}")
    description("Delete a user by ID")
    parameter("id", :path, :integer, "User ID", required: true)
    response(code(:no_content), "User deleted")
    response(code(:unprocessable_entity), "Could not delete user")
  end

  def delete_user(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)

    case Accounts.delete_user!(user) do
      {:ok, _user} ->
        send_resp(conn, :no_content, "")

      {:error, _reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: "Could not delete user"})
    end
  end

  swagger_path :login do
    post("/login")
    description("Login a user")
    parameter(:body, :body, Schema.ref(:UserRequest), "User request payload", required: true)
    response(code(:ok), "User logged in")
    response(code(:unauthorized), "Invalid email or password")
  end

  def login(conn, %{"user" => user_params}) do
    case Accounts.authenticate_user(user_params) do
      {:ok, user} ->
        conn
        |> put_status(:ok)
        |> json(user)
      {:error, _reason} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{errors: "Invalid email or password"})
    end
  end
end
