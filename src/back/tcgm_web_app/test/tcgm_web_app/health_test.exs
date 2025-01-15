defmodule TcgmWebApp.HealthTest do
  use TcgmWebApp.DataCase

  alias TcgmWebApp.Health

  describe "health_checks" do
    alias TcgmWebApp.Health.Check

    import TcgmWebApp.HealthFixtures

    @invalid_attrs %{status: nil}

    test "list_health_checks/0 returns all health_checks" do
      check = check_fixture()
      assert Health.list_health_checks() == [check]
    end

    test "get_check!/1 returns the check with given id" do
      check = check_fixture()
      assert Health.get_check!(check.id) == check
    end

    test "create_check/1 with valid data creates a check" do
      valid_attrs = %{status: "some status"}

      assert {:ok, %Check{} = check} = Health.create_check(valid_attrs)
      assert check.status == "some status"
    end

    test "create_check/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Health.create_check(@invalid_attrs)
    end

    test "update_check/2 with valid data updates the check" do
      check = check_fixture()
      update_attrs = %{status: "some updated status"}

      assert {:ok, %Check{} = check} = Health.update_check(check, update_attrs)
      assert check.status == "some updated status"
    end

    test "update_check/2 with invalid data returns error changeset" do
      check = check_fixture()
      assert {:error, %Ecto.Changeset{}} = Health.update_check(check, @invalid_attrs)
      assert check == Health.get_check!(check.id)
    end

    test "delete_check/1 deletes the check" do
      check = check_fixture()
      assert {:ok, %Check{}} = Health.delete_check(check)
      assert_raise Ecto.NoResultsError, fn -> Health.get_check!(check.id) end
    end

    test "change_check/1 returns a check changeset" do
      check = check_fixture()
      assert %Ecto.Changeset{} = Health.change_check(check)
    end
  end
end
