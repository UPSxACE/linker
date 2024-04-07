import { GoDotFill } from "react-icons/go";

export default function StatusBadge({ status }: { status: number }) {
  function getStatus() {
    // FIXME
    return { className: "text-green-600", message: "Online" };
  }

  const { className, message } = getStatus();

  return (
    <div className="flex select-none items-center gap-1 rounded-lg bg-mantine-dark-6 px-2 py-1 pr-[0.80rem] text-sm">
      <GoDotFill className={className} />
      {message}
    </div>
  );
}
