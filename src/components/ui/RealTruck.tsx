import { cn } from "@/lib/cn";

/* Source art is 1101x402 with the cab on the left; wheel layers are 140px
   circles cut from the same photo so they can spin in place. */
export const REAL_TRUCK = {
  width: 1101,
  height: 402,
  wheel: 140,
} as const;

/* Driver poses share one box over the cab window; animate by toggling `data-pose`. */
export const DRIVER_POSES = ["idle", "blink", "look", "laugh"] as const;
export type DriverPose = (typeof DRIVER_POSES)[number];

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
  /** Rendered width of the full-size truck, so the browser can pick a smaller file. */
  sizes?: string;
  /** Seat a driver behind the cab window. */
  driver?: boolean;
};

const TRUCK_SRCSET =
  "/trucks/rmw-truck-sm.webp 480w, /trucks/rmw-truck-720.webp 720w, /trucks/rmw-truck.webp 1101w";

export function RealTruck({
  className,
  flip,
  rolling,
  small,
  priority,
  sizes = "100vw",
  driver,
}: Props) {
  const src = small ? "/trucks/rmw-truck-sm.webp" : "/trucks/rmw-truck.webp";

  return (
    <span
      className={cn("real-truck", flip && "is-flipped", rolling && "is-rolling", className)}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="real-truck-body"
        src={src}
        srcSet={small ? undefined : TRUCK_SRCSET}
        sizes={small ? undefined : sizes}
        alt="Ritz Media World painted Indian truck"
        width={REAL_TRUCK.width}
        height={REAL_TRUCK.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
      />
      {flip &&
        ["is-sign", "is-horn"].map((panel) => (
          <span
            key={panel}
            className={cn("real-truck-panel", panel)}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      {driver && (
        <span className="real-truck-cab" data-pose="idle">
          <span className="real-truck-driver">
            {DRIVER_POSES.map((pose) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={pose}
                className="real-truck-pose"
                data-pose={pose}
                src={`/trucks/driver/${pose}.webp`}
                alt="Truck driver at the wheel"
                width={336}
                height={192}
                loading={priority ? "eager" : "lazy"}
                draggable={false}
              />
            ))}
          </span>
        </span>
      )}
      <span className="real-truck-wheel is-front">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/trucks/rmw-wheel-front.webp" alt="Truck front wheel" width={140} height={140} draggable={false} />
      </span>
      <span className="real-truck-wheel is-rear">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/trucks/rmw-wheel-rear.webp" alt="Truck rear wheel" width={140} height={140} draggable={false} />
      </span>
    </span>
  );
}
