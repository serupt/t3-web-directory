import { User } from "@prisma/client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { trpc } from "../utils/trpc";
import LoadingOverlay from "./LoadingOverlay";
import AddUser from "./ManageUsers/AddUser";
import EditUsers from "./ManageUsers/EditUsers";

const tableThreads = ["ID", "Username", "Role", "Created At", "Updated At"];

function getSuccessNotificationMessage(message: string) {
  toast.success(message, {
    style: {
      borderRadius: "10px",
      background: "#2B303A",
      color: "#fff",
      borderColor: "#B392AC",
    },
    iconTheme: { primary: "#B392AC", secondary: "#fff" },
  });
}

function getErrorNotificationMessage(message: string) {
  toast.error(message, {
    style: {
      borderRadius: "10px",
      background: "#2B303A",
      color: "#fff",
      borderColor: "#B392AC",
    },
    iconTheme: { primary: "#B392AC", secondary: "#fff" },
  });
}

export default function ManageUsers() {
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [addUserModalOpened, setAddUserModalOpened] = useState(false);
  const [editUserModalOpened, setEditUserModalOpened] = useState(false);

  const getUsers = trpc.users.getAll.useQuery();
  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      getUsers.refetch();
      getSuccessNotificationMessage("User added successfully!");
    },
    onError: (e) => getErrorNotificationMessage(e.message),
  });
  const editUsername = trpc.users.editUsername.useMutation({
    onSuccess: () => {
      getUsers.refetch();
      getSuccessNotificationMessage("User edited successfully!");
    },
    onError: (e) => getErrorNotificationMessage(e.message),
  });
  const editPassword = trpc.users.editPassword.useMutation({
    onSuccess: () => {
      getUsers.refetch();
      getSuccessNotificationMessage("User edited successfully!");
    },
    onError: (e) => getErrorNotificationMessage(e.message),
  });
  const deleteUser = trpc.users.delete.useMutation({
    onSuccess: () => {
      getUsers.refetch();
      getSuccessNotificationMessage("User deleted successfully!");
    },
    onError: (e) => getErrorNotificationMessage(e.message),
  });

  return (
    <div>
      <nav className="flex items-center space-x-5 px-5 pt-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search users..."
          className=" input-sm w-1/4  rounded bg-primary-800  focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          className="btn btn-sm gap-2 bg-secondary-700 hover:bg-secondary-600"
          onClick={() => setAddUserModalOpened(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add New User
        </button>
      </nav>
      <div className="divider px-2 before:bg-secondary after:bg-secondary"></div>
      <main className="overflow-x-auto px-2">
        {getUsers.isFetched && getUsers.data ? (
          <table className="w-full text-left ">
            <thead>
              <tr>
                {tableThreads.map((thread, index) => {
                  return (
                    <th key={index} className="px-4 py-2 text-base">
                      {thread}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {getUsers.data
                .sort((a, b) =>
                  a.username.toLocaleLowerCase() <
                  b.username.toLocaleLowerCase()
                    ? -1
                    : 1
                )
                .filter((user) =>
                  user.username
                    .toLocaleLowerCase()
                    .includes(query.toLocaleLowerCase().trim())
                )
                .map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="text-base odd:bg-primary-800 hover:cursor-pointer hover:bg-primary-700"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditUserModalOpened(true);
                      }}
                    >
                      <td className="px-4 py-2">{user.id}</td>
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">
                        {user.created_at.toLocaleDateString() +
                          " " +
                          user.created_at.toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2">
                        {user.updated_at.toLocaleDateString() +
                          " " +
                          user.updated_at.toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <LoadingOverlay />
        )}
      </main>
      <>
        {getUsers.data && selectedUser ? (
          <EditUsers
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            editUserModalOpened={editUserModalOpened}
            setEditUserModalOpened={setEditUserModalOpened}
            onEditUsername={(data) => {
              editUsername.mutate({ id: selectedUser.id, ...data });
              setEditUserModalOpened(false);
              setSelectedUser(undefined);
            }}
            onEditPassword={(data) => {
              editPassword.mutate({
                id: selectedUser.id,
                password: data.password,
              });
              setEditUserModalOpened(false);
              setSelectedUser(undefined);
            }}
            onDelete={(data) => {
              deleteUser.mutate(data);
              setEditUserModalOpened(false);
              setSelectedUser(undefined);
            }}
          />
        ) : null}
        {getUsers.data && (
          <AddUser
            addUserModalOpened={addUserModalOpened}
            setAddUserModalOpened={setAddUserModalOpened}
            onAdd={(data) => {
              createUser.mutate(data);
              setAddUserModalOpened(false);
            }}
          />
        )}
      </>
      <div>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
