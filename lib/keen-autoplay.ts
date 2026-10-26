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
      if (typeof document !== "undefined" && document.hidden) return;
      if (!slider.track?.details || slider.track.details.slides.length <= 1) return;

      timeout = setTimeout(() => {
        if (!slider.track?.details || slider.track.details.slides.length <= 1) return;
        const details = slider.track.details;
        const isEnd = details.rel >= details.maxIdx;
        if (isEnd && !slider.options.loop) {
          slider.moveToIdx(0);
        } else {
          slider.next();
        }
      }, delay);
    }

    function onVisibilityChange() {
      if (typeof document !== "undefined" && document.hidden) {
        clearNextTimeout();
      } else {
        nextTimeout();
      }
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
        slider.container.addEventListener("touchstart", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("touchend", () => {
          mouseOver = false;
          nextTimeout();
        });
      }

      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", onVisibilityChange);
      }

      nextTimeout();
    });

    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
    slider.on("destroyed", () => {
      clearNextTimeout();
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
    });
  };
};
