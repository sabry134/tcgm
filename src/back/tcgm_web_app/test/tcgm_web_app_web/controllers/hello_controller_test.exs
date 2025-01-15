defmodule TcgmWebAppWeb.HelloControllerTest do
  use TcgmWebAppWeb.ConnCase

  import TcgmWebApp.GreetingsFixtures

  alias TcgmWebApp.Greetings.Hello

  @create_attrs %{
    message: "some message"
  }
  @update_attrs %{
    message: "some updated message"
  }
  @invalid_attrs %{message: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all hellos", %{conn: conn} do
      conn = get(conn, ~p"/api/hellos")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create hello" do
    test "renders hello when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/hellos", hello: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/hellos/#{id}")

      assert %{
               "id" => ^id,
               "message" => "some message"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/hellos", hello: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update hello" do
    setup [:create_hello]

    test "renders hello when data is valid", %{conn: conn, hello: %Hello{id: id} = hello} do
      conn = put(conn, ~p"/api/hellos/#{hello}", hello: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/hellos/#{id}")

      assert %{
               "id" => ^id,
               "message" => "some updated message"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, hello: hello} do
      conn = put(conn, ~p"/api/hellos/#{hello}", hello: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete hello" do
    setup [:create_hello]

    test "deletes chosen hello", %{conn: conn, hello: hello} do
      conn = delete(conn, ~p"/api/hellos/#{hello}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/hellos/#{hello}")
      end
    end
  end

  defp create_hello(_) do
    hello = hello_fixture()
    %{hello: hello}
  end
end
