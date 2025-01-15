defmodule TcgmWebAppWeb.CheckControllerTest do
  use TcgmWebAppWeb.ConnCase

  import TcgmWebApp.HealthFixtures

  alias TcgmWebApp.Health.Check

  @create_attrs %{
    status: "some status"
  }
  @update_attrs %{
    status: "some updated status"
  }
  @invalid_attrs %{status: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all health_checks", %{conn: conn} do
      conn = get(conn, ~p"/api/health_checks")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create check" do
    test "renders check when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/health_checks", check: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/health_checks/#{id}")

      assert %{
               "id" => ^id,
               "status" => "some status"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/health_checks", check: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update check" do
    setup [:create_check]

    test "renders check when data is valid", %{conn: conn, check: %Check{id: id} = check} do
      conn = put(conn, ~p"/api/health_checks/#{check}", check: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/health_checks/#{id}")

      assert %{
               "id" => ^id,
               "status" => "some updated status"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, check: check} do
      conn = put(conn, ~p"/api/health_checks/#{check}", check: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete check" do
    setup [:create_check]

    test "deletes chosen check", %{conn: conn, check: check} do
      conn = delete(conn, ~p"/api/health_checks/#{check}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/health_checks/#{check}")
      end
    end
  end

  defp create_check(_) do
    check = check_fixture()
    %{check: check}
  end
end
