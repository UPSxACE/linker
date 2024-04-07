import clsx from "clsx";

export default function HeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const background = "bg-[#141414]"; //"bg-neutral-900"; //"bg-[#0e0e0e]";
  return (
    <div
      className={clsx(
        `select-none ${background} flex-1 shrink overflow-hidden px-5 py-4`,
        className,
      )}
    >
      <span className="block text-base font-medium text-neutral-300">
        {children}
      </span>
    </div>
  );
}
