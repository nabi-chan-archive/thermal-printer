import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

import { Tab } from "@/hooks/useTabs";

type TabListProps = {
  tabList: Tab[];

  newTab: () => void;
  isCurrentTab: (index: number) => boolean;
  removeTab: (index: number) => () => void;
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
    <div className="tabs w-full">
      {tabList.map(({ title }, index) => (
        <div
          role="button"
          key={index}
          onClick={setTab(index)}
          className={[
            "tab tab-bordered flex-1 justify-between",
            isCurrentTab(index) ? "tab-active" : "",
          ].join(" ")}
        >
          <span>{title || "무제"}</span>

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
      <button
        className="tab btn btn-square btn-sm btn-ghost ml-2"
        onClick={newTab}
      >
        <FaPlus />
      </button>
    </div>
  );
}
