import { KeenSliderPlugin } from "keen-slider/react";

export const AutoplayPlugin = (
  delay = 4000,
  pauseOnHover = true
): KeenSliderPlugin => {
  return (slider) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let mouseOver = false;

    function clearNextTimeout() {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    }

    function nextTimeout() {
      clearNextTimeout();
      if (mouseOver && pauseOnHover) return;
      timeout = setTimeout(() => {
        slider.next();
      }, delay);
    }

    slider.on("created", () => {
      if (pauseOnHover) {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
      }
      nextTimeout();
    });
    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
    slider.on("destroyed", clearNextTimeout);
  };
};

