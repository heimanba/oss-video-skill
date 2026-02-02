import { AbsoluteFill } from "remotion";

export interface LoadingOverlayProps {
  /**
   * Opacity of the overlay
   */
  opacity?: number;
  /**
   * Custom loading message
   */
  message?: string;
}

/**
 * LoadingOverlay - Displays a loading state message
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  opacity = 1,
  message = "Loading...",
}) => (
  <div
    className="absolute inset-0 flex items-center justify-center"
    style={{ opacity }}
  >
    <div className="text-slate-400 text-lg">{message}</div>
  </div>
);

export interface ErrorOverlayProps {
  /**
   * Error message to display
   */
  message: string;
  /**
   * Opacity of the overlay
   */
  opacity?: number;
}

/**
 * ErrorOverlay - Displays an error state message
 */
export const ErrorOverlay: React.FC<ErrorOverlayProps> = ({
  message,
  opacity = 1,
}) => (
  <div
    className="absolute inset-0 flex items-center justify-center"
    style={{ opacity }}
  >
    <div className="text-red-400 text-lg">Error: {message}</div>
  </div>
);

export interface StatusWrapperProps {
  /**
   * Loading state
   */
  loading: boolean;
  /**
   * Error message (null if no error)
   */
  error: string | null;
  /**
   * Custom loading message
   */
  loadingMessage?: string;
  /**
   * Children to render when not loading/error
   */
  children: React.ReactNode;
}

/**
 * StatusWrapper - Wraps content with loading/error states
 * Returns loading or error overlay when applicable, otherwise renders children
 */
export const StatusWrapper: React.FC<StatusWrapperProps> = ({
  loading,
  error,
  loadingMessage,
  children,
}) => {
  if (loading) {
    return (
      <AbsoluteFill className="bg-[#020617] flex flex-col items-center justify-center">
        <LoadingOverlay message={loadingMessage} />
      </AbsoluteFill>
    );
  }

  if (error) {
    return (
      <AbsoluteFill className="bg-[#020617] flex flex-col items-center justify-center">
        <ErrorOverlay message={error} />
      </AbsoluteFill>
    );
  }

  return <>{children}</>;
};
