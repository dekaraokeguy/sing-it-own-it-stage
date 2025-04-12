
// Sound effects for the Sing It Own It karaoke app

// Sound file URLs - replace with actual Supabase URLs when available
const CLICK_SOUND_URL = "https://example.com/click.mp3";
const HOVER_SOUND_URL = "https://example.com/hover.mp3";
const SUCCESS_SOUND_URL = "https://example.com/success.mp3";

// Audio objects with lazy loading to avoid unnecessary downloads
let clickSound: HTMLAudioElement | null = null;
let hoverSound: HTMLAudioElement | null = null;
let successSound: HTMLAudioElement | null = null;

// Initialize a sound (only when needed)
const initializeSound = (url: string): HTMLAudioElement => {
  const audio = new Audio(url);
  audio.volume = 0.5; // Set default volume to 50%
  return audio;
};

// Play functions with lazy initialization
export const playClickSound = (): void => {
  if (!clickSound) {
    clickSound = initializeSound(CLICK_SOUND_URL);
  }
  clickSound.currentTime = 0;
  clickSound.play().catch(error => console.error("Error playing click sound:", error));
};

export const playHoverSound = (): void => {
  if (!hoverSound) {
    hoverSound = initializeSound(HOVER_SOUND_URL);
  }
  hoverSound.currentTime = 0;
  hoverSound.play().catch(error => console.error("Error playing hover sound:", error));
};

export const playSuccessSound = (): void => {
  if (!successSound) {
    successSound = initializeSound(SUCCESS_SOUND_URL);
  }
  successSound.currentTime = 0;
  successSound.play().catch(error => console.error("Error playing success sound:", error));
};

// Success flash notification
export const showSuccessFlash = (message: string = "Success!"): void => {
  playSuccessSound();
  
  const flash = document.createElement("div");
  flash.textContent = `✅ ${message}`;
  flash.style.position = "fixed";
  flash.style.top = "20px";
  flash.style.right = "20px";
  flash.style.background = "#4CAF50";
  flash.style.color = "white";
  flash.style.padding = "10px 20px";
  flash.style.borderRadius = "12px";
  flash.style.zIndex = "9999";
  flash.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
  flash.style.opacity = "0";
  flash.style.transition = "opacity 0.3s ease";
  
  document.body.appendChild(flash);
  
  // Fade in
  setTimeout(() => {
    flash.style.opacity = "1";
  }, 10);
  
  // Fade out and remove
  setTimeout(() => {
    flash.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(flash);
    }, 300);
  }, 2500);
};
