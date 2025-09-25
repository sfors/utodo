export function navigateTo(to: string) {
  history.pushState(null, "", to);
  window.dispatchEvent(new CustomEvent("router:navigate"));
}

export function useNavigateTo() {
  return (to: string) => navigateTo(to);
}
