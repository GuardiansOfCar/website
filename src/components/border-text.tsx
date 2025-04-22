"use client";
import React, { useEffect, useRef, useState } from "react";

interface BorderTextProps {
  children: string;
  className?: string;
}

export const BorderText: React.FC<BorderTextProps> = ({
                                                        children,
                                                        className,
                                                      }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<{
    width: number;
    height: number;
    fontSize: number;
  } | null>(null);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    const updateSize = () => {
      const style = window.getComputedStyle(span);
      const fontSize = parseFloat(style.fontSize);
      setSize({
        width: span.offsetWidth,
        height: span.offsetHeight,
        fontSize: fontSize,
      });
    };

    updateSize();
  }, [children, className]);

  const strokeWidth = 4;

  if (!size)
    return (
        <span
            ref={spanRef}
            className={`${className}`}
            style={{
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
        >
        {children}
      </span>
    );

  const padding = strokeWidth * 2;
  const svgWidth = size.width + padding;
  const svgHeight = size.height + padding;

  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const fontSize = size.fontSize;

  return (
      <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
      >
        {/* Outer Stroke Text */}
        <text
            x={centerX}
            y={centerY}
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={fontSize}
            fontWeight="bold"
            className={className}
            stroke="#000"
            strokeWidth={strokeWidth}
            fill="none"
        >
          {children}
        </text>

        {/* Fill Text */}
        <text
            x={centerX}
            y={centerY}
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={fontSize}
            fontWeight="bold"
            className={className}
            stroke="none"
            fill="white"
        >
          {children}
        </text>
      </svg>
  );
};