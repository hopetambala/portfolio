import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as styles from "./popover.module.css";

export const Popover = ({
  trigger,
  position = "start",
  children,
  className,
}) => {
  const buttonRef = useRef();
  const contentRef = useRef();
  const [menuCoord, setMenuCoord] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const clx = [`popover ${styles.popover}`];
  if (className) clx.push(className);

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      const buttonEl = buttonRef.current;
      const coord = {
        top: buttonEl.offsetTop + buttonEl.offsetHeight,
        left:
          position === "start"
            ? buttonEl.offsetLeft
            : buttonEl.offsetLeft - buttonEl.offsetWidth,
      };
      setMenuCoord(coord);
    } else {
      setMenuCoord(null);
    }
  };

  function clickOutsideListener(event) {
    // Clicked element is a descendant of
    // the menu or button.
    if (
      buttonRef.current?.contains(event.target) ||
      contentRef.current == null ||
      contentRef.current?.contains(event.target)
    ) {
      return;
    }

    setIsOpen(false);
  }

  useEffect(() => {
    document.addEventListener("mousedown", clickOutsideListener);
    document.addEventListener("touchstart", clickOutsideListener);

    return () => {
      document.removeEventListener("mousedown", clickOutsideListener);
      document.removeEventListener("touchstart", clickOutsideListener);
    };
  }, []);

  return (
    <>
      <div className={clx.join(" ")} ref={buttonRef} onClick={handleClick}>
        {trigger}
      </div>
      {isOpen &&
        createPortal(
          <div
            style={{
              top: menuCoord.top,
              left: menuCoord.left,
              position: "absolute",
            }}
            ref={contentRef}
          >
            {children}
          </div>,
          document.querySelector("body")
        )}
    </>
  );
};
