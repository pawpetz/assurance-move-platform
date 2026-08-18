import {
  Building2,
  Home,
  MapPin,
  Milestone,
  Package,
  Route as RouteIcon,
  Sofa,
  Trash2,
  Truck,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Home,
  Building2,
  MapPin,
  Route: RouteIcon,
  Milestone,
  Truck,
  Sofa,
  Trash2,
  Package,
};

export function ServiceIcon({ name, className = "" }: { name: string; className?: string }) {
  const Icon = map[name] ?? Truck;
  return (
    <span
      className={`flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary ${className}`}
    >
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}