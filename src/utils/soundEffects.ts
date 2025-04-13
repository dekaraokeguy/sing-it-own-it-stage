
// Sound effects for interactive elements

// Load sound effects from public assets
export const playClickSound = () => {
  try {
    const clickSound = new Audio('/click.mp3');
    clickSound.volume = 0.3;
    clickSound.play().catch((error) => {
      console.error('Error playing click sound:', error);
    });
  } catch (error) {
    console.error('Error playing click sound:', error);
  }
};

export const playSuccessSound = () => {
  try {
    const successSound = new Audio('/success.mp3');
    successSound.volume = 0.4;
    successSound.play().catch((error) => {
      console.error('Error playing success sound:', error);
    });
  } catch (error) {
    console.error('Error playing success sound:', error);
  }
};

export const playErrorSound = () => {
  try {
    const errorSound = new Audio('/error.mp3');
    errorSound.volume = 0.4;
    errorSound.play().catch((error) => {
      console.error('Error playing error sound:', error);
    });
  } catch (error) {
    console.error('Error playing error sound:', error);
  }
};
