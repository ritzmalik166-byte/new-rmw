import { preload } from "react-dom";
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
  "/trucks/rmw-truck-sm.webp 480w, /trucks/rmw-truck-600.webp 600w, /trucks/rmw-truck-720.webp 720w, /trucks/rmw-truck.webp 1101w";

export function RealTruck({
  className,
  flip,
  rolling,
  small,
  priority,
  sizes = "100vw",
  driver,
}: Props) {
  const src = small ? "/trucks/rmw-truck-xs.webp" : "/trucks/rmw-truck.webp";
  if (priority) {
    // Hoisted into <head> so the download starts before the parser reaches the hero.
    preload(src, {
      as: "image",
      fetchPriority: "high",
      imageSrcSet: small ? undefined : TRUCK_SRCSET,
      imageSizes: small ? undefined : sizes,
    });
  }

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
                src={`/trucks/driver/sm/${pose}.webp`}
                alt="Truck driver at the wheel"
                width={168}
                height={96}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={pose === "idle" ? undefined : "low"}
                draggable={false}
              />
            ))}
          </span>
        </span>
      )}
      <TruckWheel position="is-front" priority={priority} />
      <TruckWheel position="is-rear" priority={priority} />
    </span>
  );
}

/* One drawn wheel for both axles: tread and rim turn, the light layer above stays fixed. */
function TruckWheel({ position, priority }: { position: string; priority?: boolean }) {
  const loading = priority ? "eager" : "lazy";
  return (
    <span className={cn("real-truck-wheel", position)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="real-truck-wheel-spin"
        src="/trucks/rmw-wheel.svg"
        alt="Truck wheel"
        width={140}
        height={140}
        loading={loading}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="real-truck-wheel-light"
        src="/trucks/rmw-wheel-light.svg"
        alt=""
        width={140}
        height={140}
        loading={loading}
        draggable={false}
      />
    </span>
  );
}
