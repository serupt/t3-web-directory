import {
  getUniqueCategories,
  getUniqueCategoryTags,
} from "../SideMapComponent";

import { Place } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface DefaultViewProps {
  entryData: Place[];
  setSelectedTag: Dispatch<SetStateAction<string>>;
}

export default function DefaultView({
  entryData,
  setSelectedTag,
}: DefaultViewProps) {
  return (
    <div>
      {getUniqueCategories(entryData).map((category, index) => {
        return (
          <div key={index} tabIndex={0} className="collapse collapse-arrow">
            <div className="collapse-title  bg-primary-800 text-xl font-medium">
              {category}
            </div>
            <div className="collapse-content space-y-2  bg-primary-800">
              {getUniqueCategoryTags(entryData, category)
                .sort()
                .map((tag) => {
                  return (
                    <p
                      key={tag}
                      className="rounded-xl p-1.5 hover:cursor-pointer hover:bg-primary-700"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </p>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
