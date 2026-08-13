import logoAsset from "@/assets/taskora-logo.png.asset.json";
import { Link } from "@tanstack/react-router";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 40, showWordmark = true, className = "" }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoAsset.url}
        alt="TASKORA logo"
        width={size}
        height={size}
        className="rounded-full"
        style={{ width: size, height: size }}
      />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-tight">
            TASK<span className="text-gradient-brand">ORA</span>
          </span>
          <span className="text-[10px] text-muted-foreground">Plan • Achieve • Learn • Grow</span>
        </div>
      )}
    </Link>
  );
}
