import clsx from "clsx";

export default function Row({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // const borderBottom =
  //   "[&:not(:last-of-type)]:border-solid [&:not(:last-of-type)]:border-b-mantine-dark-7";
  const borderBottom =
    "[&:not(:last-of-type)]:border-solid [&:not(:last-of-type)]:border-b-mantine-dark-4";
  return (
    <div
      className={clsx(
        `flex flex-row border-0 border-b text-xl ${borderBottom}`,
        className,
      )}
    >
      {children}
    </div>
  );
}
