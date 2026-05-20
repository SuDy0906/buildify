"use client";

import { useEffect, useState } from "react";

export default function ParallaxSpheres() {
  const [offsets, setOffsets] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Calculate shifts relative to center
      setOffsets({
        x: (x - 0.5),
        y: (y - 0.5),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Compute positions with varying speeds
  const sphere1Style = {
    transform: `translate(${offsets.x * 20}px, ${offsets.y * 20}px)`,
  };

  const sphere2Style = {
    transform: `translate(${offsets.x * 40}px, ${offsets.y * 40}px)`,
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top Left Sphere */}
      <div
        className="parallax-sphere absolute top-[10%] left-[5%] w-[350px] h-[350px] bg-[#cfbcff] rounded-full"
        style={sphere1Style}
      />
      {/* Bottom Right Sphere */}
      <div
        className="parallax-sphere absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-[#cdc0e9] rounded-full"
        style={sphere2Style}
      />
    </div>
  );
}
