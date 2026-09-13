/**
 * LienLibre TXQR (Transfer data via animated QR codes)
 * Implementation inspired by and compatible with TXQR by Ivan Daniluk (https://github.com/divan/txqr)
 * Licensed under the MIT License.
 * 
 * Copyright (c) 2026 LienLibre Contributors
 * Copyright (c) 2018-2024 Ivan Daniluk (divan)
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LienLibreTXQR = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Helper to generate a short 4-char session ID
  function generateSessionId() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }

  /**
   * TXQREncoder
   * Breaks a string payload into sequential chunks for animated QR stream transmission
   */
  class TXQREncoder {
    constructor(payload, options = {}) {
      this.rawPayload = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
      this.chunkSize = options.chunkSize || 120; // optimal bytes per frame for high-speed scanning
      this.sessionId = options.sessionId || generateSessionId();
      this.fps = options.fps || 8;
      this.chunks = [];
      this.currentIndex = 0;
      this.timer = null;
      this.isPlaying = false;
      this.canvas = null;
      this.onFrame = options.onFrame || null;

      this.initChunks();
    }

    initChunks() {
      const data = this.rawPayload;
      const totalLen = data.length;
      const numChunks = Math.ceil(totalLen / this.chunkSize) || 1;
      this.chunks = [];

      for (let i = 0; i < numChunks; i++) {
        const start = i * this.chunkSize;
        const end = Math.min(start + this.chunkSize, totalLen);
        const chunkData = data.slice(start, end);
        // TXQR standard frame format: TXQR:v1:<sessionId>:<index>/<total>:<data>
        const frameText = `TXQR:v1:${this.sessionId}:${i + 1}/${numChunks}:${chunkData}`;
        this.chunks.push({
          index: i + 1,
          total: numChunks,
          frameText: frameText,
          data: chunkData
        });
      }
    }

    getTotalFrames() {
      return this.chunks.length;
    }

    getCurrentFrame() {
      return this.chunks[this.currentIndex] || null;
    }

    renderToCanvas(canvas, renderQRCallback) {
      this.canvas = canvas;
      this.renderCurrent(renderQRCallback);
    }

    renderCurrent(renderQRCallback) {
      if (!this.canvas || this.chunks.length === 0) return;
      const frame = this.chunks[this.currentIndex];
      if (typeof renderQRCallback === 'function') {
        renderQRCallback(frame.frameText, this.canvas);
      } else if (typeof LienLibreQR !== 'undefined' && LienLibreQR.render) {
        LienLibreQR.render(frame.frameText, this.canvas, {
          size: 220,
          margin: 2,
          colorDark: '#0f172a',
          colorLight: '#ffffff'
        });
      }
      if (typeof this.onFrame === 'function') {
        this.onFrame(frame, this.currentIndex, this.chunks.length);
      }
    }

    start(renderQRCallback) {
      this.stop();
      this.isPlaying = true;
      const interval = Math.max(50, Math.round(1000 / this.fps));
      this.timer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.chunks.length;
        this.renderCurrent(renderQRCallback);
      }, interval);
    }

    stop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.isPlaying = false;
    }

    setFPS(fps, renderQRCallback) {
      this.fps = Math.max(1, Math.min(30, fps));
      if (this.isPlaying) {
        this.start(renderQRCallback);
      }
    }

    next(renderQRCallback) {
      this.currentIndex = (this.currentIndex + 1) % this.chunks.length;
      this.renderCurrent(renderQRCallback);
    }

    prev(renderQRCallback) {
      this.currentIndex = (this.currentIndex - 1 + this.chunks.length) % this.chunks.length;
      this.renderCurrent(renderQRCallback);
    }
  }

  /**
   * TXQRDecoder
   * Reassembles chunks received from animated QR streams into complete original payloads
   */
  class TXQRDecoder {
    constructor() {
      this.sessions = new Map(); // sessionId -> { total, chunks: Map<index, data>, timestamp }
      this.activeSessionId = null;
    }

    reset(sessionId) {
      if (sessionId) {
        this.sessions.delete(sessionId);
        if (this.activeSessionId === sessionId) this.activeSessionId = null;
      } else {
        this.sessions.clear();
        this.activeSessionId = null;
      }
    }

    /**
     * Process a raw scanned string.
     * Supports TXQR standard protocol or direct fallback.
     */
    feed(scannedText) {
      if (!scannedText || typeof scannedText !== 'string') return null;

      // Check for TXQR protocol signature
      const match = scannedText.match(/^TXQR:v1:([A-Z0-9_-]+):(\d+)\/(\d+):(.*)$/s);
      if (!match) {
        // Not a TXQR frame; could be a single static QR or standard URL
        return {
          isTXQR: false,
          isComplete: true,
          payload: scannedText,
          received: 1,
          total: 1,
          percent: 100
        };
      }

      const [, sessionId, strIndex, strTotal, chunkData] = match;
      const index = parseInt(strIndex, 10);
      const total = parseInt(strTotal, 10);

      if (!this.sessions.has(sessionId)) {
        this.sessions.set(sessionId, {
          sessionId,
          total,
          chunks: new Map(),
          createdAt: Date.now()
        });
      }

      const session = this.sessions.get(sessionId);
      this.activeSessionId = sessionId;
      session.chunks.set(index, chunkData);

      const receivedCount = session.chunks.size;
      const percent = Math.min(100, Math.round((receivedCount / total) * 100));
      const isComplete = (receivedCount >= total);

      let fullPayload = null;
      if (isComplete) {
        const parts = [];
        for (let i = 1; i <= total; i++) {
          parts.push(session.chunks.get(i) || '');
        }
        fullPayload = parts.join('');
      }

      return {
        isTXQR: true,
        sessionId,
        index,
        total,
        receivedCount,
        percent,
        isComplete,
        payload: fullPayload,
        missingIndexes: Array.from({ length: total }, (_, i) => i + 1).filter(i => !session.chunks.has(i))
      };
    }
  }

  /**
   * TXQRCameraScanner
   * Live camera scanner using BarcodeDetector API (with fast fallback)
   */
  class TXQRCameraScanner {
    constructor(options = {}) {
      this.videoElement = options.videoElement || null;
      this.onScan = options.onScan || null;
      this.onError = options.onError || null;
      this.stream = null;
      this.isScanning = false;
      this.barcodeDetector = null;
      this.animFrameId = null;

      if ('BarcodeDetector' in window) {
        try {
          this.barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
        } catch (_) {
          this.barcodeDetector = null;
        }
      }
    }

    async startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("L'accès à la caméra n'est pas supporté par ce navigateur.");
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
        await this.videoElement.play();
      }

      this.isScanning = true;
      this.loopScan();
    }

    stopCamera() {
      this.isScanning = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
      if (this.videoElement) {
        this.videoElement.srcObject = null;
      }
    }

    async loopScan() {
      if (!this.isScanning) return;

      if (this.videoElement && this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
        try {
          if (this.barcodeDetector) {
            const barcodes = await this.barcodeDetector.detect(this.videoElement);
            if (barcodes && barcodes.length > 0) {
              const rawVal = barcodes[0].rawValue;
              if (rawVal && typeof this.onScan === 'function') {
                this.onScan(rawVal);
              }
            }
          }
        } catch (_) {}
      }

      if (this.isScanning) {
        this.animFrameId = requestAnimationFrame(() => this.loopScan());
      }
    }
  }

  return {
    Encoder: TXQREncoder,
    Decoder: TXQRDecoder,
    CameraScanner: TXQRCameraScanner
  };
}));
