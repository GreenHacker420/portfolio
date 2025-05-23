
import React, { useRef } from 'react';
import * as THREE from 'three';
import { KEYBOARD_LAYOUT } from '../../../../data/keyboardData';
import { KeyboardTheme } from './KeyboardThemes';
import KeyboardBase from '../KeyboardBase';
import Key from './Key';

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
    // Calculate row width
    const rowWidth = row.reduce((sum, key, idx) => {
      const width = (key.physical?.size?.[0] || 1) * keySize[0];
      return sum + width + (idx < row.length - 1 ? keySpacing : 0);
    }, 0);

    // Center row on X, position row on Z
    const rowZ = (rowIndex * (keySize[2] + keySpacing));

    return (
      <group key={`row-${rowIndex}`} position={[0, 0, rowZ]}>
        {row.map((key, keyIndex) => {
          // X position for each key
          let posX = 0;
          for (let i = 0; i < keyIndex; i++) {
            posX += ((row[i].physical?.size?.[0] || 1) * keySize[0]) + keySpacing;
          }
          const keyWidth = (key.physical?.size?.[0] || 1) * keySize[0];
          const finalX = posX + keyWidth / 2 - rowWidth / 2;

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
      </group>
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]} rotation={[-0.1, 0, 0]}>
      {/* Keyboard base */}
      <KeyboardBase
        width={baseWidth}
        height={2.5}
        depth={baseDepth}
        rgbGlow={[0.0, 0.8, 0.4]}
      />

      {/* Key layout - positioned on top of the base */}
      <group position={[0, 0.15, -2]}>
        {keyboardLayout}
      </group>
    </group>
  );
};

export default KeyboardComponent;
