/**
 * Triggers a callback once an element enters the viewport (or immediately if SSR / no IntersectionObserver).
 * Returns a cleanup function to disconnect the observer if unmounted early.
 */
export function lazy_load(
  element: HTMLElement,
  callback: () => void | Promise<void>,
  options: IntersectionObserverInit = { rootMargin: "200px" },
): () => void {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    void callback();
    return () => {};
  }

  let observer: IntersectionObserver | null = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer?.disconnect();
      observer = null;
      void callback();
    }
  }, options);

  observer.observe(element);

  return () => {
    observer?.disconnect();
    observer = null;
  };
}
