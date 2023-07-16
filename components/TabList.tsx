import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MouseEvent } from "react";

import { Tab } from "@/hooks/useTabs";

type TabListProps = {
  tabList: Tab[];

  newTab: () => void;
  isCurrentTab: (index: number) => boolean;
  removeTab: (index: number) => (e: MouseEvent<HTMLButtonElement>) => void;
  setTab: (index: number) => () => void;
};

export default function TabList({
  tabList,

  newTab,
  removeTab,
  isCurrentTab,
  setTab,
}: TabListProps) {
  return (
    <div className="tabs w-full flex-nowrap overflow-x-auto">
      {tabList.map(({ title }, index) => (
        <div
          role="button"
          key={index}
          onClick={setTab(index)}
          className={[
            "tab tab-bordered flex-1 justify-between min-w-[150px] gap-2 flex-nowrap",
            isCurrentTab(index) ? "tab-active" : "",
          ].join(" ")}
        >
          <span className="truncate">{title || "무제"}</span>

          {tabList.length > 1 && (
            <button
              className="btn btn-square btn-xs btn-ghost"
              onClick={removeTab(index)}
            >
              <FaXmark />
            </button>
          )}
        </div>
      ))}
      <button className="btn btn-square btn-sm btn-ghost ml-2" onClick={newTab}>
        <FaPlus />
      </button>
    </div>
  );
}
