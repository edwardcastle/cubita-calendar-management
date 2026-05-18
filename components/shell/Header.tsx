type Props = {
  title: string;
  action?: React.ReactNode;
};

export function Header({ title, action }: Props) {
  return (
    <header className="fixed top-0 inset-x-0 h-14 bg-background/95 backdrop-blur border-b z-40 flex items-center justify-between px-4">
      <h1 className="text-base font-semibold truncate">{title}</h1>
      {action ? <div>{action}</div> : null}
    </header>
  );
}
