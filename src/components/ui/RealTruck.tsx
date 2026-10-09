import { cn } from "@/lib/cn";

/* Source art is 1101x402 with the cab on the left; wheel layers are 140px
   circles cut from the same photo so they can spin in place. */
export const REAL_TRUCK = {
  width: 1101,
  height: 402,
  wheel: 140,
} as const;

/** Turn the wheels of the `.real-truck` inside `scope` to match `distance` px travelled. */
export function setWheelTurn(scope: HTMLElement, distance: number) {
  const truck = scope.matches(".real-truck")
    ? scope
    : scope.querySelector<HTMLElement>(".real-truck");
  if (!truck || !truck.offsetWidth) return;
  const circumference = Math.PI * truck.offsetWidth * (REAL_TRUCK.wheel / REAL_TRUCK.width);
  truck.style.setProperty("--wheel-turn", `${(((distance / circumference) * 360) % 360).toFixed(2)}deg`);
}

type Props = {
  className?: string;
  /** Face right instead of left (cab on the right). */
  flip?: boolean;
  /** Spin the wheels continuously; otherwise drive them with `--wheel-turn`. */
  rolling?: boolean;
  small?: boolean;
  priority?: boolean;
};

export function RealTruck({ className, flip, rolling, small, priority }: Props) {
  return (
    <span
      className={cn("real-truck", flip && "is-flipped", rolling && "is-rolling", className)}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="real-truck-body"
        src={small ? "/trucks/rmw-truck-sm.webp" : "/trucks/rmw-truck.webp"}
        alt=""
        width={REAL_TRUCK.width}
        height={REAL_TRUCK.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
      />
      <span className="real-truck-wheel is-front">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/trucks/rmw-wheel-front.webp" alt="" width={140} height={140} draggable={false} />
      </span>
      <span className="real-truck-wheel is-rear">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/trucks/rmw-wheel-rear.webp" alt="" width={140} height={140} draggable={false} />
      </span>
    </span>
  );
}
