import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { trpc } from "../utils/trpc";
import LoadingOverlay from "./LoadingOverlay";
import AddUser from "./ManageUsers/AddUser";
import ChangeUsername from "./ManageUsers/ChangeUsername";

import { useTranslation } from "next-i18next";
import UserTable from "./ManageUsers/UserTable";
import ChangePassword from "./ManageUsers/ChangePassword";
import DeleteConfirmation from "./ManageUsers/DeleteConfirmation";

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
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { t } = useTranslation("common");

  const { data: session } = useSession();

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
      <nav className="mb-[-10px] flex items-center space-x-5 px-5 pt-3">
        <button
          className="btn-sm btn gap-2 bg-secondary-700 text-white hover:bg-secondary-600"
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
          {t("add_user")}
        </button>
      </nav>
      <div className="divider px-2 before:bg-secondary after:bg-secondary"></div>
      <main className="overflow-x-auto px-2">
        {getUsers.isFetched &&
        getUsers.data &&
        session?.user.role === "SUPERADMIN" ? (
          <UserTable
            users={getUsers.data}
            setSelectedUser={setSelectedUser}
            setShowChangeUsername={setShowChangeUsername}
            setShowChangePassword={setShowChangePassword}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
          />
        ) : getUsers.isFetched &&
          getUsers.data &&
          session?.user.role === "ADMIN" ? (
          <UserTable
            users={getUsers.data.filter((user) => user.role === "USER")}
            setSelectedUser={setSelectedUser}
            setShowChangeUsername={setShowChangeUsername}
            setShowChangePassword={setShowChangePassword}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
          />
        ) : (
          <LoadingOverlay />
        )}
      </main>
      <>
        {getUsers.data && selectedUser ? (
          <ChangeUsername
            selectedUser={selectedUser}
            showChangeUsername={showChangeUsername}
            setShowChangeUsername={setShowChangeUsername}
            onEditUsername={(data) => {
              editUsername.mutate({ id: selectedUser.id, ...data });
              setEditUserModalOpened(false);
              setSelectedUser(undefined);
            }}
          />
        ) : null}
        {getUsers.data && selectedUser ? (
          <ChangePassword
            selectedUser={selectedUser}
            showChangePassword={showChangePassword}
            setShowChangePassword={setShowChangePassword}
            onEditPassword={(data) => {
              editPassword.mutate({
                id: selectedUser.id,
                password: data.password,
              });
              setEditUserModalOpened(false);
              setSelectedUser(undefined);
            }}
          />
        ) : null}
        {getUsers.data && selectedUser ? (
          <DeleteConfirmation
            selectedUser={selectedUser}
            showDeleteConfirmation={showDeleteConfirmation}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
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
