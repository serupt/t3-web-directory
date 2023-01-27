import { Place } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { MapProps } from "./DisplayMap";
import DefaultView from "./SideMap/DefaultView";
import SelectedEntryView from "./SideMap/SelectedEntryView";
import SelectedTagView from "./SideMap/SelectedTagView";

import { useTranslation } from "next-i18next";

export function getUniqueCategoryTags(data: Place[], category: string) {
  const uniqueTag: string[] = [];
  data.map((value) => {
    if (value.category === category) {
      value.tags.map((tag) => {
        if (!uniqueTag.includes(tag)) {
          uniqueTag.push(tag);
        }
      });
    }
  });
  return uniqueTag;
}

export function getUniqueCategories(data: Place[]) {
  const uniqueCategories: string[] = [];
  data.map((value) => {
    if (!uniqueCategories.includes(value.category)) {
      uniqueCategories.push(value.category);
    }
  });
  return uniqueCategories;
}

export default function SideMapComponent({
  entryData,
  selectedEntry,
  setSelectedEntry,
  selectedTag,
  setSelectedTag,
}: MapProps) {
  const [query, setQuery] = useState("");
  const { data: session } = useSession();
  const { t } = useTranslation("common");

  return (
    <>
      <div className="flex h-screen flex-col space-y-2 p-2 ">
        {session ? (
          <>
            <div className="top sticky space-y-2 pb-1">
              {selectedEntry || selectedTag ? (
                <button
                  onClick={() => {
                    if (selectedEntry) {
                      setSelectedEntry(undefined);
                    } else {
                      setSelectedTag("");
                    }
                  }}
                  className="btn-sm w-full rounded bg-secondary-700 hover:bg-secondary-600"
                >
                  {t("back")}
                </button>
              ) : (
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  //@ts-ignore
                  placeholder={t("search")}
                  className=" input-sm w-full rounded bg-primary-800 focus:outline-none focus:ring-secondary"
                />
              )}
            </div>
            <div className="divider before:bg-secondary after:bg-secondary"></div>
          </>
        ) : (
          <>
            <div className="top sticky space-y-2 pb-1 text-center">
              <div>
                <span className="text-2xl font-bold">NYCT Directory</span>
              </div>
              <Link href={"/login"}>
                <button className="btn-sm w-full rounded bg-secondary-700 font-bold hover:bg-secondary-600 ">
                  {t("login")}
                </button>
              </Link>
              {/* <div className="divider mb-0 before:bg-secondary after:bg-secondary"></div> */}
            </div>
            <div className="space-y-2 pb-1">
              {selectedEntry || selectedTag ? (
                <button
                  onClick={() => {
                    if (selectedEntry) {
                      setSelectedEntry(undefined);
                    } else {
                      setSelectedTag("");
                    }
                  }}
                  className="btn-sm w-full rounded bg-secondary-700 hover:bg-secondary-600"
                >
                  {t("back")}
                </button>
              ) : (
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  //@ts-ignore
                  placeholder={t("search")}
                  className=" input-sm w-full rounded bg-primary-800 focus:outline-none focus:ring-secondary"
                />
              )}
            </div>
            <div className="divider before:bg-secondary after:bg-secondary"></div>
          </>
        )}
        <div className="flex-1 overflow-y-scroll">
          <div>
            {selectedEntry ? (
              <SelectedEntryView selectedEntry={selectedEntry} />
            ) : selectedTag || query ? (
              <SelectedTagView
                entryData={entryData}
                query={query}
                setQuery={setQuery}
                setSelectedEntry={setSelectedEntry}
                selectedTag={selectedTag}
              />
            ) : (
              <DefaultView
                entryData={entryData}
                setSelectedTag={setSelectedTag}
              />
            )}
          </div>
        </div>
        <div className="bottom sticky flex h-16 items-center justify-center space-x-2">
          <img src="/nyct.svg" className="h-16 w-56" />
        </div>
      </div>
    </>
  );
}
