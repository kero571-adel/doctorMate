// /* src/services/firebaseService.js */
// import {db} from "../utils/firebase";
// import {
//   collection,
//   addDoc,
//   query,
//   where,
//   onSnapshot,
//   orderBy,
//   Timestamp,
// } from "firebase/firestore";

// /**
//  * Subscribe to real-time messages for a session
//  * @param {string} sessionId - The session ID
//  * @param {function} onMessagesChange - Callback when messages change
//  * @returns {function} Unsubscribe function
//  */
// export const subscribeToSessionMessages = (sessionId, onMessagesChange) => {
//   if (!sessionId) {
//     console.error("Session ID is required");
//     return () => {};
//   }

//   try {
//     // ✅ استخدم chat_sessions مش sessions
//     const messagesRef = collection(db, `chat_sessions/${sessionId}/messages`);
//     const q = query(messagesRef, orderBy("timestamp", "asc"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const messages = [];
//       snapshot.forEach((doc) => {
//         messages.push({
//           id: doc.id,
//           ...doc.data(),
//         });
//       });
//       onMessagesChange(messages);
//     });

//     return unsubscribe;
//   } catch (error) {
//     console.error("Error subscribing to messages:", error);
//     return () => {};
//   }
// };

// /**
//  * Send a message to Firebase
//  * @param {string} sessionId - The session ID
//  * @param {object} messageData - Message object with text, senderType, senderId, etc.
//  * @returns {Promise<string>} Message document ID
//  */
// export const sendMessage = async (sessionId, messageData) => {
//   if (!sessionId) {
//     throw new Error("Session ID is required to send message");
//   }

//   try {
//     // ✅ استخدم chat_sessions
//     const messagesRef = collection(db, `chat_sessions/${sessionId}/messages`);
//     const docRef = await addDoc(messagesRef, {
//       ...messageData,
//       timestamp: Timestamp.now(),
//       createdAt: new Date().toISOString(),
//     });

//     return docRef.id;
//   } catch (error) {
//     console.error("Error sending message:", error);
//     throw error;
//   }
// };

// /**
//  * Create or get session room in Firestore
//  * @param {string} sessionId - Session ID
//  * @param {object} sessionData - Session metadata
//  * @returns {Promise<void>}
//  */
// export const initializeSessionRoom = async (sessionId, sessionData) => {
//   if (!sessionId) {
//     throw new Error("Session ID is required");
//   }

//   try {
//     // ✅ استخدم chat_sessions
//     const sessionRef = collection(db, "chat_sessions");
//     console.log(`Session room initialized for: ${sessionId}`);
//   } catch (error) {
//     console.error("Error initializing session room:", error);
//     throw error;
//   }
// };

// export default {
//   subscribeToSessionMessages,
//   sendMessage,
//   initializeSessionRoom,
// };
/* src/services/firebaseService.js */
// ✅ 1. صحح مسار الاستيراد
import { db } from "../utils/firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";

/**
 * Subscribe to real-time messages for a session
 * @param {string} sessionId - The session ID
 * @param {function} onMessagesChange - Callback when messages change
 * @returns {function} Unsubscribe function
 */
export const subscribeToSessionMessages = (sessionId, onMessagesChange) => {
  if (!sessionId) {
    console.error("Session ID is required");
    return () => {};
  }

  try {
    const messagesRef = collection(db, `chat_sessions/${sessionId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,

          // ✅ 2. تطبيع حقل النص: خذ النص من أي حقل موجود
          text: data.text || data.content || data.body || "",

          // ✅ 3. تحويل Firebase Timestamp لـ ISO String عشان Redux
          timestamp: data.timestamp?.toDate
            ? data.timestamp.toDate() // Firebase Timestamp → Date
            : data.createdAt
            ? new Date(data.createdAt) // ISO String → Date
            : new Date(), // fallback
        });
      });
      onMessagesChange(messages);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to messages:", error);
    return () => {};
  }
};

/**
 * Send a message to Firebase
 * @param {string} sessionId - The session ID
 * @param {object} messageData - Message object with text, senderType, senderId, etc.
 * @returns {Promise<string>} Message document ID
 */
export const sendMessage = async (sessionId, messageData) => {
  if (!sessionId) {
    throw new Error("Session ID is required to send message");
  }

  try {
    const messagesRef = collection(db, `chat_sessions/${sessionId}/messages`);
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      timestamp: Timestamp.now(),
      createdAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Create or get session room in Firestore
 * @param {string} sessionId - Session ID
 * @param {object} sessionData - Session metadata
 * @returns {Promise<void>}
 */
export const initializeSessionRoom = async (sessionId, sessionData) => {
  if (!sessionId) {
    throw new Error("Session ID is required");
  }

  try {
    const sessionRef = collection(db, "chat_sessions");
    console.log(`Session room initialized for: ${sessionId}`);
    // ⚠️ ملاحظة: الدالة دي مش بتعمل save للبيانات، لو عايز تحفظ:
    // await setDoc(doc(sessionRef, sessionId), sessionData);
  } catch (error) {
    console.error("Error initializing session room:", error);
    throw error;
  }
};

export default {
  subscribeToSessionMessages,
  sendMessage,
  initializeSessionRoom,
};
