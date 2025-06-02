
import React, { useRef } from 'react';
import * as THREE from 'three';
import { KEYBOARD_LAYOUT } from '../../../../data/keyboardData';
import { KeyboardTheme } from './KeyboardThemes';
import KeyboardBase from '../KeyboardBase';
import Key from './Key';
import '../../../../types/three-jsx';

interface KeyboardProps {
  onSelectKey: (key: string) => void;
  selectedKey: string | null;
  theme: KeyboardTheme;
  performanceMode: boolean;
}

/**
 * Main keyboard component that renders the base and all keys
 */
const KeyboardComponent = ({ onSelectKey, selectedKey, theme, performanceMode }: KeyboardProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate base size dynamically
  const getKeyboardDimensions = () => {
    let maxRowWidth = 0;
    KEYBOARD_LAYOUT.forEach(row => {
      const width = row.reduce((sum, key, idx) => {
        const keyWidth = (key.physical?.size?.[0] || 1);
        return sum + keyWidth + (idx < row.length - 1 ? 0.15 : 0);
      }, 0);
      if (width > maxRowWidth) maxRowWidth = width;
    });
    const totalRows = KEYBOARD_LAYOUT.length;
    const rowDepth = 1 + 0.15; // 1 unit depth per key, 0.15 spacing
    const totalDepth = totalRows * rowDepth - 0.15;
    return { baseWidth: maxRowWidth, baseDepth: totalDepth };
  };

  const { baseWidth, baseDepth } = getKeyboardDimensions();

  // Create keyboard layout with keys
  const keySpacing = 0.15;
  const keySize: [number, number, number] = [1, 0.35, 1];

  const keyboardLayout = KEYBOARD_LAYOUT.map((row, rowIndex) => {
    // Center row on X, position row on Z
    const rowZ = (rowIndex * (keySize[2] + keySpacing));

    return (
      /* @ts-ignore */
      <group key={`row-${rowIndex}`} position={[0, 0, rowZ]}>
        {row.map((key) => {
          return (
            <Key
              key={key.id}
              keyData={key}
              isPressed={selectedKey === key.id}
              onClick={() => onSelectKey(key.id)}
              theme={theme}
              performanceMode={performanceMode}
            />
          );
        })}
      {/* @ts-ignore */}
      </group>
    );
  });

  return (
    /* @ts-ignore */
    <group ref={groupRef} position={[0, 0.2, 0]} rotation={[-0.1, 0, 0]}>
      {/* Keyboard base */}
      <KeyboardBase
        width={baseWidth}
        height={2.5}
        depth={baseDepth}
        rgbGlow={[0.0, 0.8, 0.4]}
      />

      {/* Key layout - positioned on top of the base */}
      {/* @ts-ignore */}
      <group position={[0, 0.15, -2]}>
        {keyboardLayout}
      {/* @ts-ignore */}
      </group>
    {/* @ts-ignore */}
    </group>
  );
};

export default KeyboardComponent;
