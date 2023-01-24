import { Place } from "@prisma/client";
import {
  Fragment,
  useEffect,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  Column,
  Table,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  sortingFns,
  FilterFn,
  SortingFn,
  ColumnDef,
  FilterFns,
  CellContext,
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import DebouncedInput from "./DebouncedInput";
import Filter from "./Filter";
import { Menu, Transition } from "@headlessui/react";

import { useTranslation } from "next-i18next";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

interface EditTableProps {
  entries: Place[];
  setSelectedEntry: Dispatch<SetStateAction<Place | undefined>>;
  setEditModalOpened: Dispatch<SetStateAction<boolean>>;
  setGalleryModalOpened: Dispatch<SetStateAction<boolean>>;
  setShowDeleteConfirmation: Dispatch<SetStateAction<boolean>>;
}

const columnHelper = createColumnHelper<Place>();

// const columns = [
//   columnHelper.accessor("name", {
//     id: "name",
//     cell: (info) => info.getValue(),
//     header: () => <span>Name</span>,
//     meta: {
//       align: "center",
//     },
//   }),
//   columnHelper.accessor("main_address", {
//     id: "main_address",
//     cell: (info) => info.getValue(),
//     header: () => <span>Address</span>,
//     meta: {
//       align: "center",
//     },
//   }),
//   columnHelper.accessor("category", {
//     id: "category",
//     cell: (info) => info.getValue(),
//     header: () => <span>Category</span>,
//     meta: {
//       align: "center",
//     },
//   }),
//   columnHelper.accessor("tags", {
//     id: "tags",
//     cell: (info) =>
//       info
//         .getValue()
//         .sort()
//         .map((tag, index) => {
//           return (
//             <span
//               key={index}
//               className="badge truncate bg-secondary-600 px-3 text-white"
//             >
//               {tag}
//             </span>
//           );
//         }),
//     header: () => <span>Tags</span>,
//     meta: {
//       align: "center",
//     },
//   }),
//   columnHelper.accessor("updated_at", {
//     id: "updated_at",
//     cell: (info) =>
//       info.getValue().toLocaleDateString() +
//       " " +
//       info.getValue().toLocaleTimeString(),
//     header: () => <span>Updated At</span>,
//     meta: {
//       align: "center",
//     },
//   }),
//   columnHelper.display({
//     id: "action",
//     header: () => <span></span>,
//     cell: () => (
//       <Menu as="div" className="relative inline-block text-left">
//         <div>
//           <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-0 px-2 py-2 hover:bg-opacity-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-0">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
//               />
//             </svg>
//           </Menu.Button>
//         </div>
//         <Transition
//           as={Fragment}
//           enter="transition ease-out duration-100"
//           enterFrom="transform opacity-0 scale-95"
//           enterTo="transform opacity-100 scale-100"
//           leave="transition ease-in duration-75"
//           leaveFrom="transform opacity-100 scale-100"
//           leaveTo="transform opacity-0 scale-95"
//         >
//           <Menu.Items className="absolute right-0 z-50  w-32 origin-top-right divide-y divide-secondary rounded-md bg-primary-800 shadow-lg ring-1 ring-secondary  focus:outline-none">
//             <div className="px-1 py-1">
//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active ? "bg-secondary text-white" : "text-white"
//                     } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
//                     onClick={() => {
//                       console.log("edit");
//                     }}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.5}
//                       stroke="currentColor"
//                       className="h-6 w-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
//                       />
//                     </svg>
//                     <p className="px-3">{t("edit_menu")}</p>
//                   </button>
//                 )}
//               </Menu.Item>
//             </div>
//             <div className="px-1 py-1">
//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active ? "bg-secondary text-white" : "text-white"
//                     } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
//                     onClick={() => {
//                       console.log("gallery");
//                     }}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.5}
//                       stroke="currentColor"
//                       className="h-6 w-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
//                       />
//                     </svg>
//                     <p className="px-3">{t("gallery")}</p>
//                   </button>
//                 )}
//               </Menu.Item>
//             </div>
//             <div className="px-1 py-1">
//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active ? "bg-red-700 text-white" : "text-white"
//                     } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
//                     onClick={() => {
//                       console.log("delete");
//                     }}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.5}
//                       stroke="currentColor"
//                       className="h-6 w-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
//                       />
//                     </svg>
//                     <p className="px-3">{t("delete")}</p>
//                   </button>
//                 )}
//               </Menu.Item>
//             </div>
//           </Menu.Items>
//         </Transition>
//       </Menu>
//     ),
//     meta: {
//       align: "center",
//     },
//   }),
// ];

export default function EditTable({
  entries,
  setEditModalOpened,
  setGalleryModalOpened,
  setSelectedEntry,
  setShowDeleteConfirmation,
}: EditTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { t } = useTranslation("common");

  const columns = useMemo<ColumnDef<Place>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        meta: {
          align: "center",
        },
      },
      {
        accessorKey: "main_address",
        id: "main_address",
        cell: (info) => info.getValue(),
        header: () => <span>Address</span>,
        meta: {
          align: "center",
        },
      },
      {
        accessorKey: "category",
        id: "category",
        cell: (info) => info.getValue(),
        header: () => <span>Category</span>,
        meta: {
          align: "center",
        },
      },
      {
        accessorKey: "tags",
        id: "tags",
        cell: (info) =>
          (info as CellContext<Place, string[]>)
            .getValue()
            .sort()
            .map((tag, index) => {
              return (
                <span
                  key={index}
                  className="badge truncate bg-secondary-600 px-3 text-white"
                >
                  {tag}
                </span>
              );
            }),
        header: () => <span>Tags</span>,
        meta: {
          align: "center",
        },
      },
      {
        accessorKey: "updated_at",
        id: "updated_at",
        cell: (info) =>
          (info as CellContext<Place, Date>).getValue().toLocaleDateString() +
          " " +
          (info as CellContext<Place, Date>).getValue().toLocaleTimeString(),
        header: () => <span>Updated At</span>,
        meta: {
          align: "center",
        },
      },
      columnHelper.display({
        id: "action",
        cell: (info) => (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-0 px-2 py-2 hover:bg-opacity-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                  />
                </svg>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-50  w-32 origin-top-right divide-y divide-secondary rounded-md bg-primary-800 shadow-lg ring-1 ring-secondary  focus:outline-none">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-secondary text-white" : "text-white"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => {
                          setSelectedEntry(info.row.original);
                          setEditModalOpened(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          />
                        </svg>
                        <p className="px-3">{t("edit_menu")}</p>
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-secondary text-white" : "text-white"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => {
                          setSelectedEntry(info.row.original);
                          setGalleryModalOpened(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                          />
                        </svg>
                        <p className="px-3">{t("gallery")}</p>
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-red-700 text-white" : "text-white"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => {
                          setSelectedEntry(info.row.original);
                          setShowDeleteConfirmation(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                        <p className="px-3">{t("delete")}</p>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ),
        meta: {
          align: "center",
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: entries,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
  });

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "name") {
      if (table.getState().sorting[0]?.id !== "name") {
        table.setSorting([{ id: "name", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  return (
    <div className="flex flex-col">
      <div className="pb-3">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="font-lg border-block border p-2 shadow"
          placeholder="Search all..."
        />
      </div>
      <div>
        <div>
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: "🔼",
                                desc: "🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                            {header.column.getCanFilter() &&
                            header.id !== "tags" &&
                            header.id !== "updated_at" ? (
                              <div>
                                <Filter column={header.column} table={table} />
                              </div>
                            ) : null}
                          </>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id} className="even:bg-primary-800">
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          align={(cell.column.columnDef.meta as any)?.align}
                          className="p-[10px]"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 pt-4">
        <button
          className="p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </svg>
          }
        </button>
        <button
          className="p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          }
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <button
          className="p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          }
        </button>

        <button
          className="p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
              />
            </svg>
          }
        </button>

        {/* <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </div>
      {/* <div>{table.getRowModel().rows.length} Rows</div>
      <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
    </div>
  );
}
