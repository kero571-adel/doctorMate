import {
  startSession,
  endSession,
  startCall,
} from "../communication/communicationSlice";
import {
  subscribeToSessionMessages,
  sendMessage,
} from "../../services/firebaseService";
import agoraService from "../../services/agoraService";

/**
 * Redux middleware helper for managing communication lifecycle
 * This provides convenient async wrappers for common communication operations
 */

export const startCommunicationSession = (dispatch, appointmentId) => {
  return dispatch(startSession({ appointmentId }));
};

export const endCommunicationSession = (dispatch, sessionId) => {
  return dispatch(endSession({ sessionId }));
};

export const initiateCommunicationCall = (dispatch, sessionId) => {
  return dispatch(startCall({ sessionId }));
};

export default {
  startCommunicationSession,
  endCommunicationSession,
  initiateCommunicationCall,
};
