import clsx from "clsx";

export default function Table({
  className,
  tableClassname,
  maxWidth,
  minWidth,
  children,
}: {
  className?: string;
  tableClassname?: string;
  maxWidth?: number;
  minWidth: number;
  children: React.ReactNode;
}) {
  // const borderAround = "border-mantine-dark-7";
  const borderAround = "border-[#00000080]";

  return (
    <div
      className={clsx(
        `flex border border-solid ${borderAround} flex-1 self-stretch overflow-hidden rounded-md`,
        className,
      )}
      style={{ maxWidth }}
    >
      <div
        style={{ maxWidth }}
        className={clsx(
          `flex flex-1 flex-col self-stretch overflow-auto`,
          tableClassname,
        )}
      >
        <div style={{ minWidth }}>{children}</div>
      </div>
    </div>
  );
}
