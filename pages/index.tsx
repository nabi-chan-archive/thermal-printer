import { useState } from "react";
import axios, { AxiosError } from "axios";
import { BlockNoteView } from "@blocknote/react";
import { toast } from "react-toastify";
import { useTabs } from "@/hooks/useTabs";
import { useEditor } from "@/hooks/useEditor";

export default function Home() {
  const {
    tabList,
    currentTab,
    currentTabIndex,

    newTab,
    renameTab,
    removeTab,
    setTab,
    isCurrentTab,
  } = useTabs();
  const [isPrinting, setIsPrinting] = useState(false);

  const { editor, contents } = useEditor({ currentTabIndex }, [
    currentTabIndex,
  ]);

  async function submit() {
    try {
      setIsPrinting(true);
      const response = await axios.post("/api/printer", contents);
      if (response.data.success) toast.success("프린트를 완료했습니다.");
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      }
    } finally {
      setIsPrinting(false);
    }
  }

  return (
    <main className="p-4 font-mono main px-[54px]">
      <div className="tabs w-full">
        {tabs.map(({ title }, index) => (
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

            {tabs.length > 1 && (
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

      <input
        type="text"
        defaultValue={currentTab.title}
        placeholder="제목을 입력해주세요"
        value={currentTab.title}
        onChange={renameTab(currentTabIndex)}
        className="input input-ghost w-full my-4 p-0 rounded-sm text-xl font-bold"
      />

      <BlockNoteView editor={editor} />

      <div className="flex justify-end mt-8">
        <button disabled={isPrinting} className="btn btn-sm" onClick={submit}>
          전송하기
        </button>
      </div>
    </main>
  );
}
