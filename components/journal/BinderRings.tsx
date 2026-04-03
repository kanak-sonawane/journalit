"use client";

export default function BinderRings() {
  const rings = [0, 1, 2, 3, 4, 5];

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between py-10 pointer-events-none"
      style={{ zIndex: 30 }}
    >
      {rings.map((i) => (
        <RingUnit key={i} />
      ))}
    </div>
  );
}

function RingUnit() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 80, height: 40 }}
    >
      {/* LEFT HOLE */}
      <div
        className="absolute"
        style={{
          width: 10,
          height: 28,
          borderRadius: 6,
          left: 8,
          background:
            "linear-gradient(180deg, #6e5208, #2a1e03 60%, #000)",
          boxShadow:
            "inset 0 2px 4px rgba(0,0,0,0.8), inset 0 -2px 3px rgba(255,255,255,0.15)",
          zIndex: 1,
        }}
      />

      {/* RIGHT HOLE */}
      <div
        className="absolute"
        style={{
          width: 10,
          height: 28,
          borderRadius: 6,
          right: 8,
          background:
            "linear-gradient(180deg, #6e5208, #2a1e03 60%, #000)",
          boxShadow:
            "inset 0 2px 4px rgba(0,0,0,0.8), inset 0 -2px 3px rgba(255,255,255,0.15)",
          zIndex: 1,
        }}
      />

      {/* HORIZONTAL METAL ROD */}
      <div
        className="absolute"
        style={{
          width: 56,
          height: 12,
          borderRadius: 8,
          background: `
            linear-gradient(
              90deg,
              #6e5208 0%,
              #caa43a 20%,
              #fff2a6 50%,
              #caa43a 80%,
              #6e5208 100%
            )
          `,
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.4)",
          zIndex: 2,
        }}
      />

      {/* CENTER SHINE */}
      <div
        className="absolute"
        style={{
          width: 20,
          height: 6,
          borderRadius: 6,
          background: "rgba(255,255,220,0.9)",
          filter: "blur(1px)",
          zIndex: 3,
        }}
      />
    </div>
  );
}