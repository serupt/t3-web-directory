import { trpc } from "../utils/trpc";
import { IconSend, IconEdit, IconTrash } from "@tabler/icons";
import { Menu, Divider, Table, Text, ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import { late } from "zod";
import { Head } from "next/document";

export default function EditComponent() {
  const hello = trpc.useQuery(["example.getAll"]);

  const [users, setUsers] = useState(hello.data); // props.users
  const [tableRows, setTableRows] = useState<JSX.Element[]>();
  const [drawerOpened, toggleDrawer] = useState(false);
  const [selectedProfileData, setSelectedProfileData] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setTableRows(
      users?.map((user, index) => (
        <tr key={index}>
          <td>{user.name}</td>
          <td>{user.description}</td>
          <td>{user.address}</td>
          <td>{user.opening_hours}</td>
          <td>{user.phone_number}</td>
          <td>{user.category}</td>
          <td>{user.tags}</td>
          <td>{user.website}</td>
          <td>
            <Menu>
              <Menu.Label>{user.name}</Menu.Label>
              <Menu.Item icon={<IconEdit />}>Edit</Menu.Item>
              <Menu.Item icon={<IconTrash />} color="red">
                Felhasználó törlése
              </Menu.Item>
            </Menu>
          </td>
        </tr>
      ))
    );
  }, [users]);

  return (
    <div>
      AHHHHHHHHHHHHH!
      <div>
        {tableRows?.length > 0 ? (
          <ScrollArea>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>description</th>
                  <th>address</th>
                  <th>opening_hours</th>
                  <th>phone_number</th>
                  <th>category</th>
                  <th>tags</th>
                  <th>website</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </Table>
          </ScrollArea>
        ) : (
          <Text align="center" weight="bold">
            Nincs megjeleníthető adat.
          </Text>
        )}
      </div>
    </div>
  );
}
