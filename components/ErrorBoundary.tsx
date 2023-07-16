import { ErrorBoundary as Boundary } from "react-error-boundary";

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Boundary
      fallbackRender={(props) => (
        <div className="p-4">
          <h1 className="text-xl">이럴수가!</h1>
          <p className="my-4">
            <code>{String(props.error)}</code> 로 인해 서비스가 중지되었습니다.
          </p>
          <button
            className="btn btn-sm"
            onClick={() => {
              window.localStorage.clear();
              props.resetErrorBoundary();
            }}
          >
            다시 새롭게 시작하기 (데이터가 모두 날라갑니다)
          </button>
        </div>
      )}
    >
      {children}
    </Boundary>
  );
}
