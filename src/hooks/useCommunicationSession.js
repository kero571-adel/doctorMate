import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessages,
  clearSession,
  setSessionStatus,
} from "../redux/communication/communicationSlice";
import { subscribeToSessionMessages } from "./firebaseService";

/**
 * Custom hook for managing communication session lifecycle
 * Handles Firebase subscription and cleanup
 */
export const useCommunicationSession = () => {
  const dispatch = useDispatch();
  const { session, sessionStatus } = useSelector(
    (state) => state.communication
  );
  const unsubscribeRef = useRef(null);

  // Subscribe to messages when session becomes active
  useEffect(() => {
    if (sessionStatus === "active" && session?.id) {
      try {
        const unsubFunc = subscribeToSessionMessages(
          session.id,
          (updatedMessages) => {
            dispatch(setMessages(updatedMessages));
          }
        );

        unsubscribeRef.current = unsubFunc;

        return () => {
          if (unsubscribeRef.current) {
            console.log(`🔄 Unsubscribing from session: ${session.id}`);
            unsubscribeRef.current();
          }
        };
      } catch (error) {
        console.error("Failed to subscribe to messages:", error);
      }
    }
  }, [sessionStatus, session?.id, dispatch]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const endSession = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    dispatch(clearSession());
  }, [dispatch]);

  return {
    isSessionActive: sessionStatus === "active" && !!session,
    sessionId: session?.id,
    endSession,
  };
};

export default useCommunicationSession;
