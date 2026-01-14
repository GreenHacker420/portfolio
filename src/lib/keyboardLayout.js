
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

// Row definitions matching the 6x4 grid in the reference image
// Row 1: JS, TS, HTML, CSS, React, Vue
// Row 2: Next, Tailwind, Node, Ex, PG, Mongo
// Row 3: Git, Github, Prettier, NPM, OpenAI, LangChain
// Row 4: Linux, Docker, Nginx, AWS, TF, Vercel

export const KEYBOARD_LAYOUT = [
    // Row 1
    [
        { id: 'js', label: 'JS', skillId: 'javascript', hotkey: '1', physical: { size: KEY_SIZES.STANDARD, position: [1.05, 0, 0] } },
        { id: 'ts', label: 'TS', skillId: 'typescript', hotkey: '2', physical: { size: KEY_SIZES.STANDARD, position: [2.1, 0, 0] } },
        { id: 'html', label: 'HTML', skillId: 'html', hotkey: '3', physical: { size: KEY_SIZES.STANDARD, position: [3.15, 0, 0] } },
        { id: 'css', label: 'CSS', skillId: 'css', hotkey: '4', physical: { size: KEY_SIZES.STANDARD, position: [4.2, 0, 0] } },
        { id: 'react', label: 'React', skillId: 'react', hotkey: '5', physical: { size: KEY_SIZES.STANDARD, position: [5.25, 0, 0] } },
        { id: 'vue', label: 'Vue', skillId: 'vue', hotkey: '6', physical: { size: KEY_SIZES.STANDARD, position: [6.3, 0, 0] } },
    ],
    // Row 2
    [
        { id: 'nextjs', label: 'Next', skillId: 'nextjs', hotkey: 'q', physical: { size: KEY_SIZES.STANDARD, position: [2.05, 1.05, 0] } },
        { id: 'tailwind', label: 'Tailwind', skillId: 'tailwind', hotkey: 'w', physical: { size: KEY_SIZES.STANDARD, position: [3.1, 1.05, 0] } },
        { id: 'node', label: 'Node', skillId: 'node', hotkey: 'e', physical: { size: KEY_SIZES.STANDARD, position: [4.15, 1.05, 0] } },
        { id: 'express', label: 'Express', skillId: 'express', hotkey: 'r', physical: { size: KEY_SIZES.STANDARD, position: [5.2, 1.05, 0] } },
        { id: 'postgres', label: 'Postgres', skillId: 'database', hotkey: 't', physical: { size: KEY_SIZES.STANDARD, position: [6.25, 1.05, 0] } },
        { id: 'mongodb', label: 'Mongo', skillId: 'mongodb', hotkey: 'y', physical: { size: KEY_SIZES.STANDARD, position: [7.3, 1.05, 0] } },
    ],
    // Row 3
    [
        { id: 'git', label: 'Git', skillId: 'git', hotkey: 'a', physical: { size: KEY_SIZES.STANDARD, position: [2.25, 2.1, 0] } },
        { id: 'github', label: 'GitHub', skillId: 'github', hotkey: 's', physical: { size: KEY_SIZES.STANDARD, position: [3.3, 2.1, 0] } },
        { id: 'prettier', label: 'Prettier', skillId: 'prettier', hotkey: 'd', physical: { size: KEY_SIZES.STANDARD, position: [4.35, 2.1, 0] } },
        { id: 'npm', label: 'NPM', skillId: 'npm', hotkey: 'f', physical: { size: KEY_SIZES.STANDARD, position: [5.4, 2.1, 0] } },
        { id: 'openai', label: 'OpenAI', skillId: 'openai', hotkey: 'g', physical: { size: KEY_SIZES.STANDARD, position: [6.45, 2.1, 0] } },
        { id: 'langchain', label: 'Lang', skillId: 'langchain', hotkey: 'h', physical: { size: KEY_SIZES.STANDARD, position: [7.5, 2.1, 0] } },
    ],
    // Row 4
    [
        { id: 'linux', label: 'Linux', skillId: 'linux', hotkey: 'z', physical: { size: KEY_SIZES.STANDARD, position: [2.75, 3.15, 0] } },
        { id: 'docker', label: 'Docker', skillId: 'docker', hotkey: 'x', physical: { size: KEY_SIZES.STANDARD, position: [3.8, 3.15, 0] } },
        { id: 'nginx', label: 'Nginx', skillId: 'nginx', hotkey: 'c', physical: { size: KEY_SIZES.STANDARD, position: [4.85, 3.15, 0] } },
        { id: 'aws', label: 'AWS', skillId: 'aws', hotkey: 'v', physical: { size: KEY_SIZES.STANDARD, position: [5.9, 3.15, 0] } },
        { id: 'tensorflow', label: 'TF', skillId: 'tensorflow', hotkey: 'b', physical: { size: KEY_SIZES.STANDARD, position: [6.95, 3.15, 0] } },
        { id: 'vercel', label: 'Vercel', skillId: 'vercel', hotkey: 'n', physical: { size: KEY_SIZES.STANDARD, position: [8, 3.15, 0] } },
    ],
];

// Flatten the keyboard layout for easier access
export const FLAT_KEYBOARD_LAYOUT = KEYBOARD_LAYOUT.flat();

// Get a key by ID
export const getKeyById = (id) => {
    return FLAT_KEYBOARD_LAYOUT.find(key => key.id === id);
};

// Get key by hotkey
export const getKeyByHotkey = (char) => {
    return FLAT_KEYBOARD_LAYOUT.find(key => key.hotkey === char.toLowerCase());
};

// Get all keys with associated skills
export const getSkillKeys = () => {
    return FLAT_KEYBOARD_LAYOUT.filter(key => key.skillId);
};
