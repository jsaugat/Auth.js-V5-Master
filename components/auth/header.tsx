import { cn } from "@/lib/utils";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div>
      <h1 className={cn("text-3xl font-semibold")}>Auth</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}