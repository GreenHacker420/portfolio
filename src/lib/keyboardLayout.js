
// Keyboard layout and configuration data (Migrated from TypeScript)

// Key size definitions (width, height, depth)
export const KEY_SIZES = {
    STANDARD: [1, 0.35, 1],      // Standard 1u key
    WIDE_1_25: [1.25, 0.35, 1],  // 1.25u key
    WIDE_1_5: [1.5, 0.35, 1],    // 1.5u key
    WIDE_1_75: [1.75, 0.35, 1],  // 1.75u key
    WIDE_2: [2, 0.35, 1],        // 2u key
    WIDE_2_25: [2.25, 0.35, 1],  // 2.25u key
    WIDE_2_75: [2.75, 0.35, 1],  // 2.75u key
    SPACE: [6.25, 0.35, 1],      // Spacebar
};

// Row definitions for a standard 60% keyboard layout
export const KEYBOARD_LAYOUT = [
    // Row 1 (number row)
    [
        { id: 'escape', label: 'ESC', physical: { size: KEY_SIZES.STANDARD, position: [0, 0, 0] } },
        { id: 'js', label: 'JS', skillId: 'js', physical: { size: KEY_SIZES.STANDARD, position: [1.05, 0, 0] } },
        { id: 'ts', label: 'TS', skillId: 'ts', physical: { size: KEY_SIZES.STANDARD, position: [2.1, 0, 0] } },
        { id: 'react', label: 'React', skillId: 'react', physical: { size: KEY_SIZES.STANDARD, position: [3.15, 0, 0] } },
        { id: 'node', label: 'Node', skillId: 'node', physical: { size: KEY_SIZES.STANDARD, position: [4.2, 0, 0] } },
        { id: 'python', label: 'PY', skillId: 'python', physical: { size: KEY_SIZES.STANDARD, position: [5.25, 0, 0] } },
        { id: 'aws', label: 'AWS', skillId: 'aws', physical: { size: KEY_SIZES.STANDARD, position: [6.3, 0, 0] } },
        { id: 'docker', label: 'Docker', skillId: 'docker', physical: { size: KEY_SIZES.STANDARD, position: [7.35, 0, 0] } },
        { id: 'mongodb', label: 'MongoDB', skillId: 'mongodb', physical: { size: KEY_SIZES.STANDARD, position: [8.4, 0, 0] } },
        { id: 'postgres', label: 'PG', skillId: 'postgres', physical: { size: KEY_SIZES.STANDARD, position: [9.45, 0, 0] } },
        { id: 'graphql', label: 'GQL', skillId: 'graphql', physical: { size: KEY_SIZES.STANDARD, position: [10.5, 0, 0] } },
        { id: 'vue', label: 'Vue', skillId: 'vue', physical: { size: KEY_SIZES.STANDARD, position: [11.55, 0, 0] } },
        { id: 'tailwind', label: 'TW', skillId: 'tailwind', physical: { size: KEY_SIZES.STANDARD, position: [12.6, 0, 0] } },
        { id: 'backspace', label: '⌫', physical: { size: KEY_SIZES.WIDE_2, position: [14.15, 0, 0] } },
    ],
    // Row 2
    [
        { id: 'tab', label: 'Tab', physical: { size: KEY_SIZES.WIDE_1_5, position: [0.75, 1.05, 0] } },
        { id: 'threejs', label: 'Three', skillId: 'threejs', physical: { size: KEY_SIZES.STANDARD, position: [2.05, 1.05, 0] } },
        { id: 'git', label: 'Git', skillId: 'git', physical: { size: KEY_SIZES.STANDARD, position: [3.1, 1.05, 0] } },
        { id: 'nextjs', label: 'Next', skillId: 'nextjs', physical: { size: KEY_SIZES.STANDARD, position: [4.15, 1.05, 0] } },
        { id: 'key-t', label: 'T', physical: { size: KEY_SIZES.STANDARD, position: [5.2, 1.05, 0] } },
        { id: 'key-y', label: 'Y', physical: { size: KEY_SIZES.STANDARD, position: [6.25, 1.05, 0] } },
        { id: 'key-u', label: 'U', physical: { size: KEY_SIZES.STANDARD, position: [7.3, 1.05, 0] } },
        { id: 'key-i', label: 'I', physical: { size: KEY_SIZES.STANDARD, position: [8.35, 1.05, 0] } },
        { id: 'key-o', label: 'O', physical: { size: KEY_SIZES.STANDARD, position: [9.4, 1.05, 0] } },
        { id: 'key-p', label: 'P', physical: { size: KEY_SIZES.STANDARD, position: [10.45, 1.05, 0] } },
        { id: 'key-bracket-left', label: '[', physical: { size: KEY_SIZES.STANDARD, position: [11.5, 1.05, 0] } },
        { id: 'key-bracket-right', label: ']', physical: { size: KEY_SIZES.STANDARD, position: [12.55, 1.05, 0] } },
        { id: 'key-backslash', label: '\\', physical: { size: KEY_SIZES.WIDE_1_5, position: [13.85, 1.05, 0] } },
    ],
    // Row 3
    [
        { id: 'caps-lock', label: 'Caps', physical: { size: KEY_SIZES.WIDE_1_75, position: [0.875, 2.1, 0] } },
        { id: 'key-a', label: 'A', physical: { size: KEY_SIZES.STANDARD, position: [2.25, 2.1, 0] } },
        { id: 'key-s', label: 'S', physical: { size: KEY_SIZES.STANDARD, position: [3.3, 2.1, 0] } },
        { id: 'key-d', label: 'D', physical: { size: KEY_SIZES.STANDARD, position: [4.35, 2.1, 0] } },
        { id: 'key-f', label: 'F', physical: { size: KEY_SIZES.STANDARD, position: [5.4, 2.1, 0] } },
        { id: 'key-g', label: 'G', physical: { size: KEY_SIZES.STANDARD, position: [6.45, 2.1, 0] } },
        { id: 'key-h', label: 'H', physical: { size: KEY_SIZES.STANDARD, position: [7.5, 2.1, 0] } },
        { id: 'key-j', label: 'J', physical: { size: KEY_SIZES.STANDARD, position: [8.55, 2.1, 0] } },
        { id: 'key-k', label: 'K', physical: { size: KEY_SIZES.STANDARD, position: [9.6, 2.1, 0] } },
        { id: 'key-l', label: 'L', physical: { size: KEY_SIZES.STANDARD, position: [10.65, 2.1, 0] } },
        { id: 'key-semicolon', label: ';', physical: { size: KEY_SIZES.STANDARD, position: [11.7, 2.1, 0] } },
        { id: 'key-quote', label: "'", physical: { size: KEY_SIZES.STANDARD, position: [12.75, 2.1, 0] } },
        { id: 'enter', label: 'Enter', physical: { size: KEY_SIZES.WIDE_2_25, position: [14, 2.1, 0] } },
    ],
    // Row 4
    [
        { id: 'left-shift', label: 'Shift', physical: { size: KEY_SIZES.WIDE_2_25, position: [1.125, 3.15, 0] } },
        { id: 'key-z', label: 'Z', physical: { size: KEY_SIZES.STANDARD, position: [2.75, 3.15, 0] } },
        { id: 'key-x', label: 'X', physical: { size: KEY_SIZES.STANDARD, position: [3.8, 3.15, 0] } },
        { id: 'key-c', label: 'C', physical: { size: KEY_SIZES.STANDARD, position: [4.85, 3.15, 0] } },
        { id: 'key-v', label: 'V', physical: { size: KEY_SIZES.STANDARD, position: [5.9, 3.15, 0] } },
        { id: 'key-b', label: 'B', physical: { size: KEY_SIZES.STANDARD, position: [6.95, 3.15, 0] } },
        { id: 'key-n', label: 'N', physical: { size: KEY_SIZES.STANDARD, position: [8, 3.15, 0] } },
        { id: 'key-m', label: 'M', physical: { size: KEY_SIZES.STANDARD, position: [9.05, 3.15, 0] } },
        { id: 'key-comma', label: ',', physical: { size: KEY_SIZES.STANDARD, position: [10.1, 3.15, 0] } },
        { id: 'key-period', label: '.', physical: { size: KEY_SIZES.STANDARD, position: [11.15, 3.15, 0] } },
        { id: 'key-slash', label: '/', physical: { size: KEY_SIZES.STANDARD, position: [12.2, 3.15, 0] } },
        { id: 'right-shift', label: 'Shift', physical: { size: KEY_SIZES.WIDE_2_75, position: [14, 3.15, 0] } },
    ],
    // Row 5 (bottom row)
    [
        { id: 'left-ctrl', label: 'Ctrl', physical: { size: KEY_SIZES.WIDE_1_25, position: [0.625, 4.2, 0] } },
        { id: 'left-win', label: 'Win', physical: { size: KEY_SIZES.WIDE_1_25, position: [2, 4.2, 0] } },
        { id: 'left-alt', label: 'Alt', physical: { size: KEY_SIZES.WIDE_1_25, position: [3.375, 4.2, 0] } },
        { id: 'space', label: 'Space', physical: { size: KEY_SIZES.SPACE, position: [7.125, 4.2, 0], isSpecial: true } },
        { id: 'right-alt', label: 'Alt', physical: { size: KEY_SIZES.WIDE_1_25, position: [10.875, 4.2, 0] } },
        { id: 'right-win', label: 'Win', physical: { size: KEY_SIZES.WIDE_1_25, position: [12.25, 4.2, 0] } },
        { id: 'right-ctrl', label: 'Ctrl', physical: { size: KEY_SIZES.WIDE_1_25, position: [13.625, 4.2, 0] } },
    ],
];

// Flatten the keyboard layout for easier access
export const FLAT_KEYBOARD_LAYOUT = KEYBOARD_LAYOUT.flat();

// Get a key by ID
export const getKeyById = (id) => {
    return FLAT_KEYBOARD_LAYOUT.find(key => key.id === id);
};

// Get all keys with associated skills
export const getSkillKeys = () => {
    return FLAT_KEYBOARD_LAYOUT.filter(key => key.skillId);
};
