import AgoraRTC from "agora-rtc-sdk-ng";

class AgoraService {
  constructor() {
    this.client = null;
    this.appId = null;
    this.isInitialized = false;
    this.localTracks = { audio: null, video: null };
    this.eventListenersSetup = false; // Track if listeners are already set up (prevents duplicates)
    console.log("🔹 [AGORA] Service initialized");
  }

  // ================= INIT =================
  /**
   * تهيئة عميل Agora
   * @param {string} appId - معرف تطبيق Agora
   */
  async initializeClient(appId) {
    console.log("🔹 [AGORA] initializeClient called");

    try {
      const appIdToUse =
        appId ||
        import.meta.env.VITE_AGORA_APP_ID ||
        process.env.REACT_APP_AGORA_APP_ID;

      if (
        !appIdToUse ||
        appIdToUse === "undefined" ||
        appIdToUse === "your_app_id_here"
      ) {
        throw new Error("Agora App ID is missing or invalid!");
      }

      this.appId = appIdToUse;

      this.client = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      this.isInitialized = true;

      console.log(
        "✅ [AGORA] Client initialized with appId:",
        this.appId?.substring(0, 8) + "..."
      );
    } catch (error) {
      console.error("❌ [AGORA] Initialization failed:", error);
      this.isInitialized = false;
      this.client = null;
      throw error;
    }
  }

  // ================= EVENTS =================
  /**
   * إعداد مستمعي الأحداث (Event Listeners)
   * ⚠️ CRITICAL: MUST be called BEFORE joinChannel() to avoid missing "user-published" events
   * Users already in channel will trigger "user-published" immediately after you join,
   * so listeners must be ready beforehand.
   * @param {Object} callbacks - دوال الـ callback للأحداث
   */
  setupEventListeners({ onUserJoined, onUserPublished, onUserLeft, onError }) {
    if (!this.client) {
      console.warn("⚠️ [AGORA] Client not initialized, cannot setup listeners");
      return;
    }

    // Prevent duplicate listener registration (avoids memory leaks & duplicate callbacks)
    if (this.eventListenersSetup) {
      console.log(
        "⚠️ [AGORA] Event listeners already setup, skipping duplicate registration"
      );
      return;
    }

    console.log("🔹 [AGORA] Setting up event listeners...");

    // ✅ 1. عندما ينضم مستخدم جديد للقناة
    // Note: user-joined fires when a remote user joins, but they may not have published tracks yet
    this.client.on("user-joined", async (user) => {
      console.log("👤 User joined channel:", user.uid);
      if (onUserJoined) {
        try {
          await onUserJoined(user);
        } catch (err) {
          console.error("❌ Error in onUserJoined callback:", err);
          // Don't rethrow - prevent one callback error from breaking the event system
        }
      }
    });

    // ✅ 2. عندما ينشر المستخدم صوت أو فيديو (بعد الانضمام)
    // CRITICAL FIX: This fires for:
    // - Users who publish AFTER joining (normal case)
    // - Users who were ALREADY in channel with published tracks when YOU join (Agora auto-fires these)
    // This is WHY setupEventListeners must be called before joinChannel
    this.client.on("user-published", async (user, mediaType) => {
      console.log("📤 User published:", mediaType, "for user:", user.uid);
      if (onUserPublished) {
        try {
          await onUserPublished(user, mediaType);
        } catch (err) {
          console.error("❌ Error in onUserPublished callback:", err);
        }
      }
    });

    // ✅ 3. عندما يوقف المستخدم البث
    this.client.on("user-unpublished", (user, mediaType) => {
      console.log("🔇 User unpublished:", mediaType, "user:", user.uid);
      // UI should handle removing/hiding the track
    });

    // ✅ 4. عندما يغادر المستخدم
    this.client.on("user-left", (user) => {
      console.log("🚪 User left:", user.uid);
      if (onUserLeft) {
        try {
          onUserLeft(user);
        } catch (err) {
          console.error("❌ Error in onUserLeft callback:", err);
        }
      }
    });

    // ✅ 5. التعامل مع الأخطاء العامة
    this.client.on("exception", (error) => {
      console.error("❌ Agora exception:", error);
      if (onError) {
        try {
          onError(error);
        } catch (err) {
          console.error("❌ Error in onError callback:", err);
        }
      }
    });

    // ✅ 6. Network quality monitoring (optional but helpful for debugging)
    this.client.on("network-quality", (stats) => {
      console.log("📶 Network quality stats:", stats);
    });

    // ✅ 7. Connection state changes for better reliability tracking
    this.client.on("connection-state-change", (curState, prevState, reason) => {
      console.log("🔗 Connection state changed:", {
        curState,
        prevState,
        reason,
      });
    });

    this.eventListenersSetup = true;
    console.log("✅ [AGORA] Event listeners setup complete");
  }

  // ================= JOIN =================
  /**
   * الانضمام لقناة المكالمة
   * ⚠️ IMPORTANT: Call setupEventListeners() BEFORE this method to avoid missing events
   * @param {string} token - توكن المصادقة
   * @param {string} channelName - اسم القناة
   * @param {number} uid - معرف المستخدم (0 = auto-assign)
   * @returns {Promise<number>} الـ UID المعين للمستخدم
   */
  async joinChannel(token, channelName, uid = 0) {
    console.log("🔹 [AGORA] joinChannel called");

    if (!this.isInitialized || !this.client) {
      throw new Error(
        "Agora client not initialized. Call initializeClient() first."
      );
    }

    if (!token || !channelName) {
      console.error("❌ Missing join data:", {
        token: token ? "***" : "missing",
        channelName,
      });
      throw new Error("Token or channelName is missing");
    }

    try {
      console.log("🔹 Joining channel:", {
        appId: this.appId?.substring(0, 8) + "...",
        channelName,
        uid: uid || "auto",
      });

      // ✅ Join the channel - returns the assigned UID
      // After successful join, Agora SDK will automatically fire "user-published" events
      // for any remote users who already have published tracks in the channel
      // (This is why listeners MUST be set up before calling join)
      const uidAssigned = await this.client.join(
        this.appId,
        channelName,
        token,
        uid
      );

      console.log(
        "✅ Joined successfully:",
        channelName,
        "with UID:",
        uidAssigned
      );
      return uidAssigned;
    } catch (error) {
      console.error("❌ Join failed:", error);
      // Clean up client state on join failure to allow retry
      this.client = null;
      this.isInitialized = false;
      this.eventListenersSetup = false;
      throw error;
    }
  }

  // ================= PUBLISH =================
  /**
   * نشر الـ stream المحلي (صوت + فيديو)
   * @param {Object} options - خيارات النشر
   * @param {Object} options.audioOptions - خيارات المايك (تمرر لـ createMicrophoneAudioTrack)
   * @param {Object} options.videoOptions - خيارات الكاميرا (تمرر لـ createCameraVideoTrack)
   * @param {boolean} options.publishAudio - هل ننشر الصوت؟ (default: true)
   * @param {boolean} options.publishVideo - هل ننشر الفيديو؟ (default: true)
   * @returns {Promise<Object>} { audio: LocalTrack, video: LocalTrack }
   */
  async publishLocalStream(options = {}) {
    console.log("🔹 [AGORA] publishLocalStream - Options:", options);

    if (!this.client || !this.isInitialized) {
      throw new Error(
        "Agora client not initialized. Call initializeClient() and joinChannel() first."
      );
    }

    const {
      audioOptions = {
        AEC: true,
        ANS: true,
        AGC: true,
      },
      videoOptions = { encoderConfig: "640x480" },
      publishAudio = true,
      publishVideo = true,
    } = options;

    const tracksToPublish = [];
    const createdTracks = { audio: null, video: null };

    try {
      if (publishAudio) {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack(
          audioOptions
        );
        createdTracks.audio = audioTrack;
        tracksToPublish.push(audioTrack);
      }
      if (publishVideo) {
        const videoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: "640x480",
          ...videoOptions,
        });
        createdTracks.video = videoTrack;
        tracksToPublish.push(videoTrack);
      }
      if (tracksToPublish.length === 0) {
        throw new Error(
          "No tracks to publish: both audio and video are disabled"
        );
      }
      // This ensures mute/unmute controls work immediately even if publish is slow
      this.localTracks = {
        audio: createdTracks.audio,
        video: createdTracks.video,
      };

      await this.client.publish(tracksToPublish);
      return createdTracks;
    } catch (error) {
      console.error("❌ [AGORA] Publish failed:", error);
      if (createdTracks.audio) {
        try {
          createdTracks.audio.stop?.();
          createdTracks.audio.close?.();
        } catch (cleanupErr) {
          console.warn("⚠️ [AGORA] Audio cleanup error:", cleanupErr);
        }
      }

      if (createdTracks.video) {
        try {
          createdTracks.video.stop?.();
          createdTracks.video.close?.();
        } catch (cleanupErr) {
          console.warn("⚠️ [AGORA] Video cleanup error:", cleanupErr);
        }
      }

      // إعادة تعيين الـ localTracks
      this.localTracks = { audio: null, video: null };

      throw error;
    }
  }

  // ================= SUBSCRIBE =================
  /**
   * الاشتراك في stream المستخدم البعيد
   * @param {Object} user - كائن المستخدم من Agora SDK (من user-joined أو user-published event)
   * @param {string} mediaType - نوع الميديا: 'audio' أو 'video' أو 'both' (default: 'both')
   * @returns {Promise<Object>} { audio: RemoteTrack|null, video: RemoteTrack|null }
   */
  async subscribeToRemoteStream(user, mediaType = "both") {
    const result = { audio: null, video: null };

    if (mediaType === "both") {
      await this.client.subscribe(user, ["audio", "video"]);
      result.audio = user.audioTrack || null;
      result.video = user.videoTrack || null;
    } else {
      await this.client.subscribe(user, mediaType);
      if (mediaType === "video") {
        result.video = user.videoTrack || null;
      } else {
        result.audio = user.audioTrack || null;
      }
    }

    return result; // ❌ بدون play هنا
  }

  // ================= LEAVE =================
  /**
   * مغادرة القناة وتنظيف الموارد
   * @returns {Promise<void>}
   */
  async leaveChannel() {
    if (!this.isInitialized || !this.client) {
      return;
    }

    try {
      // ✅ 1. أوقف وقفل الـ tracks المحلية (استخدم الـ helper لضمان التنظيف الصحيح)
      await this._cleanupLocalTracks();

      // ✅ 2. مغادرة القناة
      await this.client.leave();

      // ✅ 3. تنظيف الـ client state بالكامل للسماح بإعادة الاستخدام
      this.client = null;
      this.isInitialized = false;
      this.eventListenersSetup = false;
      this.localTracks = { audio: null, video: null };
    } catch (error) {
      console.error(" [AGORA] Leave failed:", error);
      // حتى لو فشل، نظّف الـ state لمنع حالة غير متسقة تسمح بإعادة المحاولة
      this.client = null;
      this.isInitialized = false;
      this.eventListenersSetup = false;
      this.localTracks = { audio: null, video: null };
      throw error;
    }
  }

  // ================= CONTROLS =================
  /**
   * كتم/إعادة صوت المايك المحلي
   * @param {boolean} muted - true للكتم، false للإعادة
   */
  async muteLocalAudio(muted) {


    if (!this.localTracks?.audio) {
      console.warn("⚠️ [AGORA] Audio track not available");
      throw new Error(
        "Audio track not initialized. Call publishLocalStream() first."
      );
    }

    try {
      // ✅ Agora SDK: setEnabled(false) = mute, setEnabled(true) = unmute
      await this.localTracks.audio.setEnabled(!muted);

    } catch (error) {
      console.error("❌ [AGORA] muteLocalAudio failed:", error);
      throw error;
    }
  }

  /**

   * @param {boolean} muted - true للإخفاء، false للإظهار
   */
  async muteLocalVideo(muted) {
    if (!this.localTracks?.video) {
      console.warn("⚠️ [AGORA] Video track not available");
      throw new Error(
        "Video track not initialized. Call publishLocalStream() first."
      );
    }
    try {
      await this.localTracks.video.setEnabled(!muted);
    } catch (error) {
      console.error("❌ [AGORA] muteLocalVideo failed:", error);
      throw error;
    }
  }

  /**
   * تبديل الكاميرا (مقدم/خلفي) - للهواتف فقط
   * @returns {Promise<void>}
   */
  async switchCamera() {
    if (!this.localTracks?.video) {
      console.warn("⚠️ [AGORA] Video track not available");
      throw new Error("Video track not initialized");
    }

    try {
      // Agora SDK: replaceTrack allows switching camera without republishing
      const newVideoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: "640x480",
        cameraId: this.localTracks.video.getMediaStreamTrack().label, // This triggers camera switch on mobile
      });

      await this.localTracks.video.replaceTrack(newVideoTrack);
      this.localTracks.video.close(); // Close old track
      this.localTracks.video = newVideoTrack;
    } catch (error) {
      console.error("❌ [AGORA] switchCamera failed:", error);
      throw error;
    }
  }

  // ================= CLEANUP =================
  /**
   * تنظيف شامل لجميع الموارد
   * Call this when component unmounts or app closes to prevent memory leaks
   */
  async cleanup() {
    this.removeEventListeners();
    await this._cleanupLocalTracks();
    if (this.client && this.isInitialized) {
      try {
        await this.client.leave();
      } catch (e) {
        console.warn(
          "⚠️ [AGORA] Leave during cleanup failed (expected if not joined):",
          e
        );
      }
    }
    this.client = null;
    this.isInitialized = false;
    this.eventListenersSetup = false;
    this.localTracks = { audio: null, video: null };
    this.appId = null;
  }

  // ================= PRIVATE HELPERS =================
  /**
   * Private helper: Clean up local tracks properly
   * Used by leaveChannel() and cleanup() to ensure no memory leaks
   * @private
   */
  async _cleanupLocalTracks() {
    if (this.localTracks.audio) {
      try {
        this.localTracks.audio.stop();
        this.localTracks.audio.close();
      } catch (e) {
        console.warn("⚠️ [AGORA] Audio track cleanup error:", e);
      }
      this.localTracks.audio = null;
    }

    if (this.localTracks.video) {
      try {
        this.localTracks.video.stop();
        this.localTracks.video.close();
      } catch (e) {
        console.warn("⚠️ [AGORA] Video track cleanup error:", e);
      }
      this.localTracks.video = null;
    }
  }

  /**
   * إزالة جميع مستمعي الأحداث
   * @public
   */
  removeEventListeners() {
    if (this.client) {
      this.client.removeAllListeners();
      this.eventListenersSetup = false;
    }
  }

  // ================= GETTERS =================
  /**
   * الحصول على قائمة المستخدمين البعيدين
   * @returns {Array} قائمة المستخدمين
   */
  getRemoteUsers() {
    return this.client?.remoteUsers || [];
  }

  /**
   * الحصول على عميل Agora
   * @returns {AgoraRTCClient|null} عميل Agora أو null
   */
  getClient() {
    return this.client;
  }

  /**
   * الحصول على الـ tracks المحلية
   * @returns {Object} { audio: LocalTrack|null, video: LocalTrack|null }
   */
  getLocalTracks() {
    return this.localTracks;
  }

  /**
   * التحقق مما إذا كان العميل مهيأ وجاهز
   * @returns {boolean}
   */
  isClientInitialized() {
    return this.isInitialized && !!this.client;
  }

  /**
   * التحقق مما إذا كنا في قناة حاليًا
   * @returns {boolean}
   */
  isInChannel() {
    return this.isClientInitialized() && this.client?.joined;
  }
}

// ✅ Singleton Pattern: إنشاء نسخة واحدة فقط من الخدمة
// يمنع إنشاء عدة instances ويوفر إدارة مركزية للحالة
const agoraService = new AgoraService();
export default agoraService;
