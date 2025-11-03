interface LordIconProps {
  src: string;
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang';
  colors?: string;
  size?: number;
  delay?: number;
  stroke?: number;
  scale?: number;
  target?: string;
}

export default function LordIcon({
  src,
  trigger = 'hover',
  colors,
  size = 100,
  delay,
  stroke,
  scale,
  target,
}: LordIconProps) {
  return (
    <lord-icon
      src={src}
      trigger={trigger}
      colors={colors}
      delay={delay}
      stroke={stroke}
      scale={scale}
      target={target}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}
