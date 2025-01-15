defmodule TcgmWebApp.GreetingsTest do
  use TcgmWebApp.DataCase

  alias TcgmWebApp.Greetings

  describe "hellos" do
    alias TcgmWebApp.Greetings.Hello

    import TcgmWebApp.GreetingsFixtures

    @invalid_attrs %{message: nil}

    test "list_hellos/0 returns all hellos" do
      hello = hello_fixture()
      assert Greetings.list_hellos() == [hello]
    end

    test "get_hello!/1 returns the hello with given id" do
      hello = hello_fixture()
      assert Greetings.get_hello!(hello.id) == hello
    end

    test "create_hello/1 with valid data creates a hello" do
      valid_attrs = %{message: "some message"}

      assert {:ok, %Hello{} = hello} = Greetings.create_hello(valid_attrs)
      assert hello.message == "some message"
    end

    test "create_hello/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Greetings.create_hello(@invalid_attrs)
    end

    test "update_hello/2 with valid data updates the hello" do
      hello = hello_fixture()
      update_attrs = %{message: "some updated message"}

      assert {:ok, %Hello{} = hello} = Greetings.update_hello(hello, update_attrs)
      assert hello.message == "some updated message"
    end

    test "update_hello/2 with invalid data returns error changeset" do
      hello = hello_fixture()
      assert {:error, %Ecto.Changeset{}} = Greetings.update_hello(hello, @invalid_attrs)
      assert hello == Greetings.get_hello!(hello.id)
    end

    test "delete_hello/1 deletes the hello" do
      hello = hello_fixture()
      assert {:ok, %Hello{}} = Greetings.delete_hello(hello)
      assert_raise Ecto.NoResultsError, fn -> Greetings.get_hello!(hello.id) end
    end

    test "change_hello/1 returns a hello changeset" do
      hello = hello_fixture()
      assert %Ecto.Changeset{} = Greetings.change_hello(hello)
    end
  end
end
