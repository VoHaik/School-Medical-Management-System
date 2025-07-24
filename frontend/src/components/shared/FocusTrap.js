import React, { useEffect, useRef } from 'react';

const FocusTrap = ({ children, active = true, returnFocusOnDeactivate = true }) => {
  const rootRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (active) {
      // Store the current active element to return focus to later
      previousFocus.current = document.activeElement;
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const root = rootRef.current;
    if (!root) return;

    // Find all focusable elements
    const focusableElements = root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when the trap is activated
    firstElement.focus();

    const handleKeyDown = (e) => {
      // Handle Tab key navigation
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // If shift+tab and on first element, move to last element
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // If tab and on last element, move to first element
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }

      // Handle Escape key
      if (e.key === 'Escape' && returnFocusOnDeactivate && previousFocus.current) {
        previousFocus.current.focus();
      }
    };

    // Add event listener for keyboard navigation
    root.addEventListener('keydown', handleKeyDown);

    return () => {
      root.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to the previously focused element when unmounting
      if (returnFocusOnDeactivate && previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [active, returnFocusOnDeactivate]);

  return <div ref={rootRef}>{children}</div>;
};

export default FocusTrap;