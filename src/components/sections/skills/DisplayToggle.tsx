


type DisplayToggleProps = {
  displayStyle: 'tabs' | 'keyboard';
  toggleDisplayStyle: () => void;
};

const DisplayToggle = ({ displayStyle, toggleDisplayStyle }: DisplayToggleProps) => {
  // Determine button text based on current display style
  const getButtonText = () => {
    switch (displayStyle) {
      case 'tabs':
        return 'Switch to Keyboard View';
      case 'keyboard':
        return 'Switch to Tabs View';
      default:
        return 'Switch View';
    }
  };

  return (
    <div className="flex justify-end mb-6">
      <button
        onClick={toggleDisplayStyle}
        className="text-sm bg-github-light/30 px-4 py-2 rounded-md text-neon-green hover:bg-github-light/50 transition-colors"
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default DisplayToggle;
