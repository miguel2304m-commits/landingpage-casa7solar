"use client";

import { forwardRef, useMemo } from "react";
import { CanvasTexture, Group, SRGBColorSpace } from "three";
import type { ThreeElements } from "@react-three/fiber";

let photovoltaicTexture: CanvasTexture | undefined;

function getCellTexture() {
  if (photovoltaicTexture) return photovoltaicTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 960;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#91a1b6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const columns = 12;
  const rows = 6;
  const cellWidth = canvas.width / columns;
  const cellHeight = canvas.height / rows;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const x = col * cellWidth + 2;
      const y = row * cellHeight + 2;
      const width = cellWidth - 4;
      const height = cellHeight - 4;
      const cut = 8;
      ctx.beginPath();
      ctx.moveTo(x + cut, y);
      ctx.lineTo(x + width - cut, y);
      ctx.lineTo(x + width, y + cut);
      ctx.lineTo(x + width, y + height - cut);
      ctx.lineTo(x + width - cut, y + height);
      ctx.lineTo(x + cut, y + height);
      ctx.lineTo(x, y + height - cut);
      ctx.lineTo(x, y + cut);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
      gradient.addColorStop(0, "#113b76");
      gradient.addColorStop(0.5, (row + col) % 3 === 0 ? "#072449" : "#092d57");
      gradient.addColorStop(1, "#061b38");
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = "rgba(154,188,220,.25)";
      ctx.lineWidth = 0.7;
      for (let line = 1; line < 20; line += 1) {
        const lineY = y + (height / 20) * line;
        ctx.beginPath();
        ctx.moveTo(x, lineY);
        ctx.lineTo(x + width, lineY);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(181,204,224,.68)";
      ctx.lineWidth = 1.3;
      for (let bus = 1; bus < 4; bus += 1) {
        const busX = x + (width / 4) * bus;
        ctx.beginPath();
        ctx.moveTo(busX, y);
        ctx.lineTo(busX, y + height);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  photovoltaicTexture = texture;
  return texture;
}

type SolarPanelProps = ThreeElements["group"] & {
  width?: number;
  height?: number;
  detailed?: boolean;
};

/** A dimensional aluminum frame, photovoltaic glass and rear mounting rails. */
const SolarPanelModel = forwardRef<Group, SolarPanelProps>(function SolarPanelModel(
  { width = 2.8, height = 1.75, detailed = true, ...props },
  ref,
) {
  const texture = useMemo(getCellTexture, []);
  const frame = 0.047;
  return (
    <group ref={ref} {...props}>
      <mesh>
        <boxGeometry args={[width, height, 0.105]} />
        <meshStandardMaterial color="#171e27" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.056]}>
        <planeGeometry args={[width - frame * 2, height - frame * 2]} />
        <meshPhysicalMaterial
          map={texture}
          metalness={0.22}
          roughness={0.22}
          clearcoat={1}
          clearcoatRoughness={0.12}
          envMapIntensity={1.35}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * (width / 2 - frame / 2), 0, 0.018]}>
            <boxGeometry args={[frame, height, 0.135]} />
            <meshStandardMaterial color="#b4bdc6" metalness={0.95} roughness={0.23} />
          </mesh>
          <mesh position={[0, side * (height / 2 - frame / 2), 0.018]}>
            <boxGeometry args={[width, frame, 0.135]} />
            <meshStandardMaterial color="#b4bdc6" metalness={0.95} roughness={0.23} />
          </mesh>
          {detailed && (
            <mesh position={[side * width * 0.3, 0, -0.08]}>
              <boxGeometry args={[0.04, height * 0.95, 0.08]} />
              <meshStandardMaterial color="#707c8d" metalness={0.9} roughness={0.32} />
            </mesh>
          )}
        </group>
      ))}
      {detailed && (
        <mesh position={[width / 2 - 0.19, -height / 2 + 0.021, 0.089]}>
          <planeGeometry args={[0.18, 0.021]} />
          <meshBasicMaterial color="#ffcf42" />
        </mesh>
      )}
    </group>
  );
});

export default SolarPanelModel;
