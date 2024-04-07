import clsx from "clsx";

export default function Cell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const background = "bg-neutral-900"; //"bg-[#0e0e0e]";
  return (
    <div
      className={clsx(
        `flex items-center ${background} flex-1 shrink overflow-hidden px-5 py-4 text-base text-neutral-300`,
        className,
      )}
    >
      {children}
    </div>
  );
}
