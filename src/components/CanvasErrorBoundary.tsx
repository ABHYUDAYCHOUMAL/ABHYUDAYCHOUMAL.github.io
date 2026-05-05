import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

/**
 * Catches errors thrown inside a 3D <Canvas /> so a broken WebGL scene
 * doesn't take down the rest of the page. If the scene throws, we render
 * a quiet fallback (or nothing) instead of crashing.
 */
class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) {
      console.warn("[3D] Canvas crashed, hiding section:", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

export default CanvasErrorBoundary;
