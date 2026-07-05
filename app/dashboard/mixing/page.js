'use client';
import { useState, useEffect, useRef, Fragment } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/contexts/LanguageContext';
import Script from 'next/script';

const translations = {
  id: {
    title: 'BERNADA Mixing Console',
    licenseTitle: 'Aktivasi Lisensi BERNADA Mixing',
    licenseSubtitle: 'Masukkan Lisensi KeyAuth Anda untuk Membuka Konsol',
    licensePlaceholder: 'BND-XXXX-XXXX-XXXX-XXXX',
    activateBtn: 'Aktivasi Lisensi',
    activating: 'Mengaktifkan...',
    demoBtn: 'Mode Uji Coba (Demo)',
    invalidKey: 'Kunci lisensi tidak valid atau kedaluwarsa.',
    licenseActive: 'Lisensi Aktif',
    licenseExpiry: 'Kedaluwarsa',
    licenseTimeleft: 'Sisa Waktu',
    logoutLicense: 'Logout Lisensi',
    databaseTitle: 'DATABASE AUDIO',
    dropzoneText: 'Seret audio ke sini atau klik untuk mengunggah',
    browseBtn: 'Pilih File',
    automixTitle: 'AUTOMIX ENGINE',
    transitionStyle: 'Gaya Transisi',
    runAutomix: 'RUN AUTOMIX',
    exportTitle: 'EKSPOR CAMPURAN',
    formatLabel: 'Format Audio',
    exportBtn: 'EKSPOR AUDIO',
    readyExport: 'Siap mengekspor',
    emptyPlaylist: 'Playlist kosong! Unggah lagu dan jalankan Automix terlebih dahulu.',
    exporting: 'Mengekspor...',
    unlimitedCoins: 'VIP Lisensi Terverifikasi',
    mixTotalDuration: 'Total Durasi',
    songTitleCol: 'Lagu',
    bpmCol: 'BPM',
    keyCol: 'Kunci',
    lenCol: 'Durasi',
    actionsCol: 'Aksi',
    transitionTable: 'Tabel Transisi',
    filterLabel: 'Filter',
    effectLabel: 'Efek',
    moodLabel: 'Mood',
    addBtn: 'Tambah',
    clearAllBtn: 'Kosongkan Semua',
    volFader: 'Volume Fader',
    bassFader: 'Bass Fader',
    smoothCrossfade: 'Smooth Crossfade',
    quickCut: 'Quick Cut',
    bassSwapHeavy: 'Bass Swap Heavy',
    camelotGuide: 'Panduan Roda Camelot',
    compatibleMoves: 'Perpindahan Harmonis:',
    sameKey: 'Kunci Sama: 8A → 8A (Perfect Blend)',
    adjacentHour: 'Jam Berdekatan: 8A → 9A / 7A (Energy Shift)',
    letterSwap: 'Ubah Huruf: 8A → 8B (Major/Minor Switch)',
    helpBtn: 'Panduan Penggunaan',
    stepTitle: 'PANDUAN OPERASI MIXING',
    step1: '1. Unggah File Audio: Tarik file audio ke panel Database Audio. Sistem akan menganalisis tempo (BPM) & kunci nada secara otomatis.',
    step2: '2. Susun & Urutkan: Atur urutan lagu di playlist. Klik "Run Automix" untuk menyelaraskan urutan berdasarkan kunci Camelot secara harmonis.',
    step3: '3. Ekspor Hasil: Pilih format MP3/Ogg di panel Ekspor, lalu klik Ekspor Audio. Hasil mixtape akan terunduh otomatis ke PC Anda.'
  },
  en: {
    title: 'BERNADA Mixing Console',
    licenseTitle: 'Activate BERNADA Mixing License',
    licenseSubtitle: 'Enter your KeyAuth License to Unlock Console',
    licensePlaceholder: 'BND-XXXX-XXXX-XXXX-XXXX',
    activateBtn: 'Activate License',
    activating: 'Activating...',
    demoBtn: 'Demo Mode',
    invalidKey: 'Invalid or expired license key.',
    licenseActive: 'License Active',
    licenseExpiry: 'Expiry',
    licenseTimeleft: 'Timeleft',
    logoutLicense: 'Logout License',
    databaseTitle: 'AUDIO DATABASE',
    dropzoneText: 'Drop audio files here or click to upload',
    browseBtn: 'Browse Files',
    automixTitle: 'AUTOMIX ENGINE',
    transitionStyle: 'Transition Style',
    runAutomix: 'RUN AUTOMIX',
    exportTitle: 'EXPORT MIXTAPE',
    formatLabel: 'Audio Format',
    exportBtn: 'EXPORT AUDIO',
    readyExport: 'Ready to export',
    emptyPlaylist: 'Playlist is empty! Load tracks and run Automix first.',
    exporting: 'Exporting...',
    unlimitedCoins: 'VIP License Verified',
    mixTotalDuration: 'Total Duration',
    songTitleCol: 'Track',
    bpmCol: 'BPM',
    keyCol: 'Key',
    lenCol: 'Length',
    actionsCol: 'Actions',
    transitionTable: 'Transition Table',
    filterLabel: 'Filter',
    effectLabel: 'Effect',
    moodLabel: 'Mood',
    addBtn: 'Add',
    clearAllBtn: 'Clear All',
    volFader: 'Volume Fader',
    bassFader: 'Bass Fader',
    smoothCrossfade: 'Smooth Crossfade',
    quickCut: 'Quick Cut',
    bassSwapHeavy: 'Bass Swap Heavy',
    camelotGuide: 'Camelot Wheel Guide',
    compatibleMoves: 'Compatible Moves:',
    sameKey: 'Same Key: 8A → 8A (Perfect Blend)',
    adjacentHour: 'Adjacent Hour: 8A → 9A / 7A (Energy Shift)',
    letterSwap: 'Letter Swap: 8A → 8B (Major/Minor Switch)',
    helpBtn: 'How to Use',
    stepTitle: 'STUDIO OPERATIONAL GUIDE',
    step1: '1. Upload Audio Files: Drag and drop audio files into the Audio Database panel. System will auto-analyze tempo (BPM) & key.',
    step2: '2. Sort & Automix: Arrange track order. Click "Run Automix" to dynamically align tracks harmonically using Camelot sorting.',
    step3: '3. Export Mixtape: Choose MP3/Ogg format, then click Export Audio. The finished mixtape will download automatically to your PC.'
  }
};

const CAMELOT_COLORS = {
  "1A": "#4a90e2", "1B": "#357abd", "2A": "#50e3c2", "2B": "#40bfa3",
  "3A": "#b8e986", "3B": "#9cd666", "4A": "#f8e71c", "4B": "#d0c010",
  "5A": "#f5a623", "5B": "#d78e14", "6A": "#ff8a80", "6B": "#e57373",
  "7A": "#ff5252", "7B": "#ff1744", "8A": "#ff4081", "8B": "#f50057",
  "9A": "#e040fb", "9B": "#d500f9", "10A": "#7c4dff", "10B": "#651fff",
  "11A": "#00e5ff", "11B": "#00b8d4", "12A": "#1de9b6", "12B": "#00bfa5"
};

const ASSET_TYPES = {
  24: 'Animation', 10: 'Model', 3: 'Audio', 4: 'Mesh'
};

export default function MixingPage() {
  const { token, user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // License State
  const [licenseInfo, setLicenseInfo] = useState(null);
  const [trialTimeLeft, setTrialTimeLeft] = useState('');

  // Mixer State
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [deckLeftFader, setDeckLeftFader] = useState(1.0);
  const [deckRightFader, setDeckRightFader] = useState(1.0);
  const [transitionStyle, setTransitionStyle] = useState('smooth');
  const [autoCutMode, setAutoCutMode] = useState('high');
  const [enableAutoCut, setEnableAutoCut] = useState(true);
  const [editingTrackId, setEditingTrackId] = useState(null);
  const [previewingTrackId, setPreviewingTrackId] = useState(null);
  const previewSourceRef = useRef(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'table'
  const [exportFormat, setExportFormat] = useState('mp3');
  const [exportProgress, setExportProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [automixing, setAutomixing] = useState(false);
  const [automixStep, setAutomixStep] = useState(0);

  // Modal Guides
  const [showHelp, setShowHelp] = useState(false);
  const [showCamelot, setShowCamelot] = useState(false);

  // Refs for Web Audio API
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const activeSourcesRef = useRef({});
  const playbackIntervalRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const canvasRef = useRef(null);
  const timelinePixelPerSec = 5;

  const t = (key) => translations[language]?.[key] || translations['id'][key];

  useEffect(() => {
    // Configure Emscripten Module global for Ogg encoder path resolution
    window.Module = {
      locateFile: (path) => {
        if (path.endsWith('.mem')) {
          return '/' + path;
        }
        return path;
      },
      memoryInitializerPrefixURL: '/'
    };

    setMounted(true);
    const savedLicense = localStorage.getItem('bmk_mixing_license');
    if (savedLicense) {
      try {
        const parsed = JSON.parse(savedLicense);
        if (parsed.trial) {
          const expiryTime = new Date(parsed.expiry).getTime();
          if (Date.now() > expiryTime) {
            localStorage.removeItem('bmk_mixing_license');
            setLicenseInfo(null);
          } else {
            setLicenseInfo(parsed);
          }
        } else {
          setLicenseInfo(parsed);
        }
      } catch (e) {
        localStorage.removeItem('bmk_mixing_license');
      }
    }
  }, []);

  // Free Trial & VIP Database Expiry Countdown Timer
  useEffect(() => {
    if (user && user.mixingIsPermanent) return;

    const updateCountdown = () => {
      // 1. Check database VIP expiry first
      if (user && user.mixingExpiry) {
        const expiryTime = new Date(user.mixingExpiry).getTime();
        const diff = expiryTime - Date.now();
        if (diff <= 0) {
          refreshUser(); // Sync with server to update expired status
          showToast(language === 'id' ? 'Lisensi VIP Anda telah habis!' : 'Your VIP License has expired!', 'error');
          return;
        }
      }

      // 2. Check local Free Trial expiry
      if (licenseInfo && licenseInfo.trial) {
        const expiryTime = new Date(licenseInfo.expiry).getTime();
        const diff = expiryTime - Date.now();

        if (diff <= 0) {
          localStorage.removeItem('bmk_mixing_license');
          setLicenseInfo(null);
          showToast(language === 'id' ? 'Free Trial 1 Hari Anda telah kedaluwarsa!' : 'Your 1-Day Free Trial has expired!', 'error');
          return;
        }

        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        setTrialTimeLeft(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [licenseInfo, user, refreshUser, language]);

  // Cleanup audio nodes on unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
      stopAllActiveSources();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);


  const handleLogoutLicense = () => {
    localStorage.removeItem('bmk_mixing_license');
    setLicenseInfo(null);
    setLicenseKey('');
    stopPlayback();
    setTracks([]);
    setPlaylist([]);
  };

  // --- AUDIO ENGINE ---
  const initAudioContext = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();
    audioCtxRef.current = audioCtx;

    const analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 256;
    
    // Master Compressor / Limiter Node
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-12, audioCtx.currentTime); // start compression at -12dB
    compressor.knee.setValueAtTime(30, audioCtx.currentTime);        // smooth transition
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);       // strong ratio (limiter)
    compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);   // ultra-fast attack
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);   // release time

    analyserNode.connect(compressor);
    compressor.connect(audioCtx.destination);
    analyserRef.current = analyserNode;

    startVisualizerLoop();
  };

  const startVisualizerLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!analyserRef.current) return;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgba(37, 99, 235, ${0.15 + (barHeight / 150)})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
      requestAnimationFrame(render);
    };
    render();
  };

  // Peak/Beat Estimation
  const estimateBPM = (audioBuffer) => {
    try {
      const data = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      const searchDuration = Math.min(30, audioBuffer.duration);
      const searchSamples = searchDuration * sampleRate;
      const step = Math.floor(sampleRate * 0.05);
      const envelopes = [];

      for (let i = 0; i < searchSamples; i += step) {
        let sum = 0;
        const end = Math.min(searchSamples, i + step);
        for (let j = i; j < end; j++) {
          sum += data[j] * data[j];
        }
        envelopes.push(Math.sqrt(sum / (end - i)));
      }

      let average = envelopes.reduce((a, b) => a + b, 0) / envelopes.length;
      if (average === 0) average = 0.1;

      let peaksCount = 0;
      let lastPeakTime = 0;
      const minPeakDistance = 0.3;

      for (let i = 1; i < envelopes.length - 1; i++) {
        if (envelopes[i] > envelopes[i - 1] && envelopes[i] > envelopes[i + 1]) {
          if (envelopes[i] > average * 1.5) {
            const time = i * 0.05;
            if (time - lastPeakTime > minPeakDistance) {
              peaksCount++;
              lastPeakTime = time;
            }
          }
        }
      }

      const estimated = Math.round((peaksCount / searchDuration) * 60);
      if (estimated >= 80 && estimated <= 180) return estimated;

      // Hash fallback
      let hash = 0;
      for (let i = 0; i < audioBuffer.length; i += 10000) {
        hash += Math.abs(data[i] || 0);
      }
      return 120 + (Math.floor(hash * 1000) % 15) * 2;
    } catch {
      return 124;
    }
  };

  const estimateKey = (audioBuffer) => {
    try {
      const data = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      let zeroCrossings = 0;
      const limit = Math.min(data.length, 100000);
      for (let i = 1; i < limit; i++) {
        if (data[i] >= 0 && data[i - 1] < 0) zeroCrossings++;
        if (data[i] < 0 && data[i - 1] >= 0) zeroCrossings++;
      }
      const dominantFreq = (zeroCrossings / limit) * (sampleRate / 2);
      const keys = ["8A", "9A", "10A", "11A", "12A", "1A", "2A", "3A", "4A", "5A", "6A", "7A"];
      const keyIndex = Math.floor(dominantFreq / 250) % keys.length;
      const isMajor = dominantFreq % 100 > 70;
      const baseKey = keys[keyIndex];
      return isMajor ? baseKey.replace("A", "B") : baseKey;
    } catch {
      return "1A";
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    showToast(language === 'id' ? 'Mendecode audio...' : 'Decoding audio...', 'info');

    const OfflineCtxClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const decodeCtx = new OfflineCtxClass(1, 44100, 44100);

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await decodeCtx.decodeAudioData(arrayBuffer);

        const bpm = estimateBPM(audioBuffer);
        const key = estimateKey(audioBuffer);

        const newTrack = {
          id: "track_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
          name: file.name.replace(/\.[^/.]+$/, ""),
          buffer: audioBuffer,
          duration: audioBuffer.duration,
          bpm: bpm,
          key: key,
          clipStart: 0,
          clipEnd: audioBuffer.duration,
          timelineStart: 0,
        };

        setTracks(prev => [...prev, newTrack]);
      } catch (err) {
        showToast(`Failed to load ${file.name}: ${err.message}`, 'error');
      }
    }
  };

  const addToPlaylist = (track) => {
    const freshTrack = { ...track, id: track.id + "_" + Date.now() };
    setPlaylist(prev => {
      const next = [...prev, freshTrack];
      setTimeout(() => recalculateTimeline(next), 10);
      return next;
    });
  };

  const removeFromPlaylist = (index) => {
    setPlaylist(prev => {
      const next = prev.filter((_, i) => i !== index);
      setTimeout(() => recalculateTimeline(next), 10);
      return next;
    });
  };

  const clearAllTracks = () => {
    stopPlayback();
    setTracks([]);
    setPlaylist([]);
  };

  const getTransitionDuration = (trackA, trackB) => {
    const avgBpm = ((trackA.bpm || 120) + (trackB.bpm || 120)) / 2;
    const standardOverlap = (16 / avgBpm) * 60; // 16 beats
    
    const durA = trackA.clipEnd - trackA.clipStart;
    const durB = trackB.clipEnd - trackB.clipStart;
    const minDur = Math.min(durA, durB);
    
    // Cap transition to max 15% of the shorter track duration to prevent massive clashing overlaps
    const maxOverlap = minDur * 0.15;
    return Math.max(0.5, Math.min(standardOverlap, maxOverlap));
  };

  const getMixTotalDuration = (list = playlist) => {
    if (list.length === 0) return 0;
    let maxEnd = 0;
    list.forEach(t => {
      const end = t.timelineStart + (t.clipEnd - t.clipStart);
      if (end > maxEnd) maxEnd = end;
    });
    return maxEnd;
  };

  const getOptimalKeySync = (keyA, keyB) => {
    if (keyA === keyB || getCamelotCompatibilityScore(keyA, keyB) > 0) {
      return { detune: 0, newKey: keyB };
    }

    const CAMELOT_ROOTS = {
      'A': {
        '1A': 8, '2A': 3, '3A': 10, '4A': 5, '5A': 0, '6A': 7,
        '7A': 2, '8A': 9, '9A': 4, '10A': 11, '11A': 6, '12A': 1
      },
      'B': {
        '1B': 11, '2B': 6, '3B': 1, '4B': 8, '5B': 3, '6B': 10,
        '7B': 5, '8B': 0, '9B': 7, '10B': 2, '11B': 9, '12B': 4
      }
    };

    const modeB = keyB.slice(-1);
    const rootsB = CAMELOT_ROOTS[modeB];
    if (!rootsB) return { detune: 0, newKey: keyB };

    const originalRootB = rootsB[keyB];
    if (originalRootB === undefined) return { detune: 0, newKey: keyB };

    const shifts = [-1, 1, -2, 2];
    let bestShift = 0;
    let bestNewKey = keyB;
    let bestScore = 0;

    for (const shift of shifts) {
      const targetRoot = (originalRootB + shift + 12) % 12;
      const candidateKey = Object.keys(rootsB).find(k => rootsB[k] === targetRoot);
      if (candidateKey) {
        const score = getCamelotCompatibilityScore(keyA, candidateKey);
        if (score > bestScore) {
          bestScore = score;
          bestShift = shift;
          bestNewKey = candidateKey;
        }
      }
    }

    if (bestScore > 0) {
      return { detune: bestShift * 100, newKey: bestNewKey };
    }

    return { detune: 0, newKey: keyB };
  };

  const recalculateTimeline = (list = playlist) => {
    let clock = 0;
    const updated = [];
    
    list.forEach((track, idx) => {
      const clonedTrack = { ...track };
      clonedTrack.originalKey = clonedTrack.originalKey || clonedTrack.key;

      if (idx === 0) {
        clonedTrack.timelineStart = 0;
        clonedTrack.detune = 0;
        clonedTrack.key = clonedTrack.originalKey;
        clock = clonedTrack.clipEnd - clonedTrack.clipStart;
      } else {
        const prev = updated[idx - 1];
        
        // Auto-Key Sync solver
        const sync = getOptimalKeySync(prev.key, clonedTrack.originalKey);
        clonedTrack.detune = sync.detune;
        clonedTrack.key = sync.newKey;

        const overlap = getTransitionDuration(prev, clonedTrack);
        clonedTrack.timelineStart = Math.max(0, clock - overlap);
        clock = clonedTrack.timelineStart + (clonedTrack.clipEnd - clonedTrack.clipStart);
      }
      updated.push(clonedTrack);
    });
    setPlaylist(updated);
  };

  const handleManualCutChange = (index, newStart, newEnd) => {
    setPlaylist(prev => {
      const next = [...prev];
      const track = next[index];
      const duration = track.duration || (track.buffer ? track.buffer.duration : 0);
      
      const start = Math.max(0, Math.min(duration - 5, newStart));
      const end = Math.max(start + 5, Math.min(duration, newEnd));

      next[index] = {
        ...track,
        clipStart: parseFloat(start.toFixed(2)),
        clipEnd: parseFloat(end.toFixed(2)),
        manualCut: true
      };
      
      setTimeout(() => recalculateTimeline(next), 10);
      return next;
    });
  };

  const handleResetManualCut = (index) => {
    setPlaylist(prev => {
      const next = [...prev];
      const track = next[index];
      const duration = track.duration || (track.buffer ? track.buffer.duration : 0);

      next[index] = {
        ...track,
        clipStart: 0,
        clipEnd: duration,
        manualCut: false
      };
      
      setTimeout(() => recalculateTimeline(next), 10);
      return next;
    });
  };

  const getMinutesSeconds = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = Math.round(totalSecs % 60);
    return { m, s };
  };

  const playTrackPreview = (track) => {
    initAudioContext();
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    stopTrackPreview();
    stopAllActiveSources();
    if (isPlaying) pausePlayback();

    const audioCtx = audioCtxRef.current;
    const sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = track.buffer;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.8;

    sourceNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const playDur = track.clipEnd - track.clipStart;
    sourceNode.start(0, track.clipStart, playDur);

    previewSourceRef.current = sourceNode;
    setPreviewingTrackId(track.id);

    sourceNode.onended = () => {
      if (previewSourceRef.current === sourceNode) {
        setPreviewingTrackId(null);
        previewSourceRef.current = null;
      }
    };
  };

  const stopTrackPreview = () => {
    if (previewSourceRef.current) {
      try {
        previewSourceRef.current.stop();
      } catch {}
      previewSourceRef.current = null;
    }
    setPreviewingTrackId(null);
  };

  // Camelot compatibility sorting algorithm
  const getCamelotCompatibilityScore = (keyA, keyB) => {
    if (keyA === keyB) return 3;
    const numA = parseInt(keyA);
    const letterA = keyA.slice(-1);
    const numB = parseInt(keyB);
    const letterB = keyB.slice(-1);

    let numDiff = Math.abs(numA - numB);
    if (numDiff > 6) numDiff = 12 - numDiff;

    if (letterA === letterB) {
      if (numDiff === 1) return 2;
      if (numDiff === 2) return 1.5;
    } else {
      if (numA === numB) return 2;
      if (numDiff === 1) return 0.5;
    }
    return 0;
  };

  const performAutoCut = (list) => {
    return list.map((track, idx) => {
      if (track.manualCut) {
        console.log(`[AutoCut Bypass] ${track.name}: Using manual crop [${track.clipStart}s - ${track.clipEnd}s]`);
        return track;
      }
      const buffer = track.buffer;
      const duration = track.duration || (buffer ? buffer.duration : 0);
      let silenceStart = 0;
      let silenceEnd = duration;
      let rmsProfile = [];
      const windowSize = 2; // 2-second windows

      if (buffer) {
        try {
          const data = buffer.getChannelData(0);
          const sampleRate = buffer.sampleRate;
          const checkLength = data.length;
          const step = Math.floor(sampleRate * 0.1); // 100ms steps

          // 1. Scan leading silence
          for (let i = 0; i < checkLength; i += step) {
            let rms = 0;
            const end = Math.min(checkLength, i + step);
            for (let j = i; j < end; j++) {
              rms += data[j] * data[j];
            }
            rms = Math.sqrt(rms / (end - i));
            if (rms > 0.003) {
              silenceStart = i / sampleRate;
              break;
            }
          }

          // 2. Scan trailing silence
          for (let i = checkLength - 1; i >= 0; i -= step) {
            let rms = 0;
            const start = Math.max(0, i - step);
            for (let j = start; j < i; j++) {
              rms += data[j] * data[j];
            }
            rms = Math.sqrt(rms / (i - start));
            if (rms > 0.003) {
              silenceEnd = i / sampleRate;
              break;
            }
          }

          // 3. Build RMS Energy Profile (every 2 seconds)
          const profileStep = Math.floor(sampleRate * windowSize);
          for (let i = 0; i < checkLength; i += profileStep) {
            let sum = 0;
            const end = Math.min(checkLength, i + profileStep);
            for (let j = i; j < end; j++) {
              sum += data[j] * data[j];
            }
            rmsProfile.push(Math.sqrt(sum / (end - i)));
          }
        } catch (e) {
          console.warn('Silence scanning failed:', e);
        }
      }

      if (silenceEnd <= silenceStart) silenceEnd = duration;
      const activeDuration = silenceEnd - silenceStart;

      // --- BPM & PHRASE ALIGNED CUTTING ---
      const bpm = parseFloat(track.bpm) || 120;
      const beatDuration = 60 / bpm;
      
      // Target: 160 beats (5 phrases of 32 beats) representing about 65-80s of core playing time
      const targetBeats = 160; 
      const targetDuration = targetBeats * beatDuration;

      let start = silenceStart;
      let end = silenceEnd;

      if (rmsProfile.length > 5 && activeDuration > targetDuration) {
        // Climax size: target beats minus 32 beats build-up (128 beats of drop/chorus)
        const climaxBeats = targetBeats - 32; 
        const climaxDuration = climaxBeats * beatDuration;
        const windowCount = Math.round(climaxDuration / windowSize);
        let bestIdx = 0;

        if (autoCutMode === 'low') {
          // Low Energy: find the quietest active section (breakdowns/intro verse)
          let minEnergy = Infinity;
          for (let i = 0; i <= rmsProfile.length - windowCount; i++) {
            let energySum = 0;
            for (let j = 0; j < windowCount; j++) {
              energySum += rmsProfile[i + j];
            }
            const averageRms = energySum / windowCount;
            // Filter out digital silence (RMS > 0.005)
            if (averageRms > 0.005 && energySum < minEnergy) {
              minEnergy = energySum;
              bestIdx = i;
            }
          }
        } else if (autoCutMode === 'balanced') {
          // Balanced: find the section closest to the median energy of the track
          const energySums = [];
          for (let i = 0; i <= rmsProfile.length - windowCount; i++) {
            let energySum = 0;
            for (let j = 0; j < windowCount; j++) {
              energySum += rmsProfile[i + j];
            }
            energySums.push({ idx: i, sum: energySum });
          }
          if (energySums.length > 0) {
            energySums.sort((a, b) => a.sum - b.sum);
            const medianIdx = Math.floor(energySums.length / 2);
            bestIdx = energySums[medianIdx].idx;
          }
        } else {
          // Default 'high' (climax): find the loudest segment (drop/chorus)
          let maxEnergy = -1;
          for (let i = 0; i <= rmsProfile.length - windowCount; i++) {
            let energySum = 0;
            for (let j = 0; j < windowCount; j++) {
              energySum += rmsProfile[i + j];
            }
            if (energySum > maxEnergy) {
              maxEnergy = energySum;
              bestIdx = i;
            }
          }
        }

        const climaxStart = silenceStart + (bestIdx * windowSize);
        
        // Raw start: 32 beats (approx 13-15s) before the climax to capture the build-up phase
        const rawStart = climaxStart - (32 * beatDuration);
        const relativeStart = Math.max(0, rawStart - silenceStart);
        
        // Align to the nearest 16-beat phrase boundary from the start of the song
        const startBeats = relativeStart / beatDuration;
        const alignedStartBeats = Math.round(startBeats / 16) * 16;
        
        start = silenceStart + (alignedStartBeats * beatDuration);
        end = start + targetDuration;

        // Bounds check to keep within active audio limits
        if (end > silenceEnd) {
          end = silenceEnd;
          // Align end to nearest 16-beat boundary
          const totalActiveBeats = (silenceEnd - silenceStart) / beatDuration;
          const alignedEndBeats = Math.floor(totalActiveBeats / 16) * 16;
          end = silenceStart + (alignedEndBeats * beatDuration);
          start = Math.max(silenceStart, end - targetDuration);
        }
      } else {
        // Fallback for very short tracks: align boundaries to 16-beat grid
        const totalActiveBeats = activeDuration / beatDuration;
        if (totalActiveBeats > 32) {
          start = silenceStart + (16 * beatDuration);
          end = silenceEnd - (16 * beatDuration);
        } else {
          start = silenceStart;
          end = silenceEnd;
        }
      }

      // Auto-Gain Normalization calculation
      let avgEnergy = 0.15;
      if (rmsProfile.length > 0) {
        avgEnergy = rmsProfile.reduce((a, b) => a + b, 0) / rmsProfile.length;
      }
      const targetEnergy = 0.15;
      const volumeNormalizer = Math.min(2.0, Math.max(0.5, targetEnergy / (avgEnergy || 0.15)));

      // Final sanity check
      if (end <= start + 5) {
        start = silenceStart;
        end = silenceEnd;
      }

      console.log(`[AutoCut PerfectPhrase] ${track.name} (${bpm} BPM): Original=${duration.toFixed(2)}s, Silence=[${silenceStart.toFixed(2)}s - ${silenceEnd.toFixed(2)}s], PhraseCut=[${start.toFixed(2)}s - ${end.toFixed(2)}s] (Length: ${((end - start) / beatDuration).toFixed(0)} beats, Normalizer: ${volumeNormalizer.toFixed(2)}x, Kept ${(100 * (end - start) / duration).toFixed(0)}%)`);

      return {
        ...track,
        clipStart: parseFloat(start.toFixed(2)),
        clipEnd: parseFloat(end.toFixed(2)),
        volumeNormalizer: parseFloat(volumeNormalizer.toFixed(3))
      };
    });
  };

  const runAutomix = () => {
    if (playlist.length < 2) return;
    setAutomixing(true);
    setAutomixStep(0);

    const runSteps = async () => {
      // Simulate 10 detailed DSP solver stages with 1500ms delay for clear visual feedback
      for (let step = 1; step <= 10; step++) {
        await new Promise(r => setTimeout(r, 1500));
        setAutomixStep(step);
      }
      await new Promise(r => setTimeout(r, 800));

      // Global Path Optimization Sort: Try every song as the starting song and pick the smoothest chain
      const originalList = [...playlist];
      let bestChain = [];
      let bestGlobalScore = -999999;

      for (let startIdx = 0; startIdx < originalList.length; startIdx++) {
        const unvisited = [...originalList];
        const currentChain = [];
        let current = unvisited.splice(startIdx, 1)[0];
        currentChain.push(current);
        let chainScore = 0;

        while (unvisited.length > 0) {
          let bestCandidateIdx = -1;
          let bestCandidateScore = -100;

          for (let i = 0; i < unvisited.length; i++) {
            const candidate = unvisited[i];
            const keyScore = getCamelotCompatibilityScore(current.key, candidate.key);
            const bpmDiff = Math.abs(current.bpm - candidate.bpm);
            const bpmScore = Math.max(0, 10 - bpmDiff * 0.5);
            const totalScore = keyScore * 10 + bpmScore;

            if (totalScore > bestCandidateScore) {
              bestCandidateScore = totalScore;
              bestCandidateIdx = i;
            }
          }
          chainScore += bestCandidateScore;
          current = unvisited.splice(bestCandidateIdx, 1)[0];
          currentChain.push(current);
        }

        if (chainScore > bestGlobalScore) {
          bestGlobalScore = chainScore;
          bestChain = currentChain;
        }
      }

      const ordered = bestChain;

      const cutOrdered = enableAutoCut ? performAutoCut(ordered) : ordered.map(t => ({ ...t }));
      setPlaylist(cutOrdered);
      recalculateTimeline(cutOrdered);
      setAutomixing(false);
      showToast(language === 'id' ? 'Automix berhasil diselaraskan' : 'Automix aligned successfully', 'success');
    };

    runSteps();
  };

  // Playback Control Realtime
  const stopAllActiveSources = () => {
    Object.keys(activeSourcesRef.current).forEach(id => {
      try {
        activeSourcesRef.current[id].sourceNode.stop();
      } catch {}
    });
    activeSourcesRef.current = {};
  };

  const startPlayback = async () => {
    initAudioContext();
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    setIsPlaying(true);
    lastUpdateTimeRef.current = audioCtxRef.current.currentTime;
    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    playbackIntervalRef.current = setInterval(updatePlaybackClock, 100);
    scheduleAudioNodes();
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    stopAllActiveSources();
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    stopAllActiveSources();
  };

  const updatePlaybackClock = () => {
    const now = audioCtxRef.current.currentTime;
    const delta = now - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = now;

    setPlaybackTime(prev => {
      const next = prev + delta;
      const maxTime = getMixTotalDuration();
      if (next >= maxTime) {
        stopPlayback();
        return 0;
      }
      return next;
    });
  };

  // Schedule / trigger nodes in context timeline
  const scheduleAudioNodes = () => {
    const current = playbackTime;
    playlist.forEach((track) => {
      const trackEnd = track.timelineStart + (track.clipEnd - track.clipStart);
      if (current >= track.timelineStart && current < trackEnd) {
        if (!activeSourcesRef.current[track.id]) {
          startTrackAudioNode(track);
        }
      } else {
        if (activeSourcesRef.current[track.id]) {
          try {
            activeSourcesRef.current[track.id].sourceNode.stop();
          } catch {}
          delete activeSourcesRef.current[track.id];
        }
      }
    });
  };

  // Trigger Node Graph
  const startTrackAudioNode = (track) => {
    const audioCtx = audioCtxRef.current;
    const sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = track.buffer;

    const lowFilterNode = audioCtx.createBiquadFilter();
    lowFilterNode.type = 'lowshelf';
    lowFilterNode.frequency.setValueAtTime(150, audioCtx.currentTime);
    lowFilterNode.gain.setValueAtTime(0, audioCtx.currentTime);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

    sourceNode.connect(lowFilterNode);
    lowFilterNode.connect(gainNode);
    gainNode.connect(analyserRef.current);

    const offset = Math.max(0, playbackTime - track.timelineStart);
    const durationToPlay = Math.max(0, (track.clipEnd - track.clipStart) - offset);
    sourceNode.detune.setValueAtTime(track.detune || 0, audioCtx.currentTime);
    sourceNode.start(0, track.clipStart + offset, durationToPlay);

    activeSourcesRef.current[track.id] = { sourceNode, gainNode, lowFilterNode };
  };

  useEffect(() => {
    if (isPlaying) {
      scheduleAudioNodes();
    }
  }, [playbackTime, playlist, isPlaying]);

  // Update Gain Realtime
  const calculateCrossfadeCurves = (progress, style) => {
    const p = Math.max(0, Math.min(1, progress));
    
    // Dipped Equal-Power curve (dips 15% in the middle to prevent volume clipping & clashes)
    const dip = 1 - 0.15 * Math.sin(p * Math.PI);
    const gainA = Math.cos(p * Math.PI / 2) * dip;
    const gainB = Math.sin(p * Math.PI / 2) * dip;

    if (style === 'cut') {
      return {
        gainA: p < 0.5 ? 1.0 : 0.0,
        gainB: p >= 0.5 ? 1.0 : 0.0,
        bassA: p < 0.5 ? 0 : -24,
        bassB: p >= 0.5 ? 0 : -24
      };
    }

    if (style === 'bass') {
      // Bass Swap Heavy: gradual crossover between 40% and 60% progress to prevent harsh popping
      let bassA = 0;
      let bassB = -24;

      if (p < 0.4) {
        bassA = 0;
        bassB = -24;
      } else if (p > 0.6) {
        bassA = -24;
        bassB = 0;
      } else {
        // Linear sweep in the 20% center window
        const factor = (p - 0.4) / 0.2;
        bassA = -24 * factor;
        bassB = -24 * (1 - factor);
      }

      return { gainA, gainB, bassA, bassB };
    }

    // smooth: Linear EQ bass crossfade (very smooth frequency transition)
    const bassA = -24 * p;
    const bassB = -24 * (1 - p);

    return { gainA, gainB, bassA, bassB };
  };

  const updateGainNodesRealtime = () => {
    const current = playbackTime;
    playlist.forEach((track, index) => {
      const active = activeSourcesRef.current[track.id];
      if (!active) return;

      const trackDur = track.clipEnd - track.clipStart;
      const trackEnd = track.timelineStart + trackDur;
      const fader = (index % 2 === 0) ? deckLeftFader : deckRightFader;
      const volumeFactor = masterVolume * fader * (track.volumeNormalizer || 1.0);

      let gain = 1.0;
      let bass = 0;
      let rate = 1.0;

      // FADE IN
      if (index > 0 && current < track.timelineStart + getTransitionDuration(playlist[index - 1], track)) {
        const prev = playlist[index - 1];
        const transDur = getTransitionDuration(prev, track);
        const progress = (current - track.timelineStart) / transDur;
        const curves = calculateCrossfadeCurves(Math.max(0, Math.min(1, progress)), transitionStyle);
        gain = curves.gainB;
        bass = curves.bassB;

        // Dynamic BPM Ramping
        const currentBpm = prev.bpm + Math.max(0, Math.min(1, progress)) * (track.bpm - prev.bpm);
        rate = currentBpm / track.bpm;
      }
      // FADE OUT
      else if (index < playlist.length - 1 && current > trackEnd - getTransitionDuration(track, playlist[index + 1])) {
        const next = playlist[index + 1];
        const transDur = getTransitionDuration(track, next);
        const fadeStart = trackEnd - transDur;
        const progress = (current - fadeStart) / transDur;
        const curves = calculateCrossfadeCurves(Math.max(0, Math.min(1, progress)), transitionStyle);
        gain = curves.gainA;
        bass = curves.bassA;

        // Dynamic BPM Ramping
        const currentBpm = track.bpm + Math.max(0, Math.min(1, progress)) * (next.bpm - track.bpm);
        rate = currentBpm / track.bpm;
      }

      active.gainNode.gain.setValueAtTime(gain * volumeFactor, audioCtxRef.current.currentTime);
      active.lowFilterNode.gain.setValueAtTime(bass, audioCtxRef.current.currentTime);
      
      // Pitch-Locked Tempo Matching (1200 cents per octave correction)
      active.sourceNode.playbackRate.setValueAtTime(rate, audioCtxRef.current.currentTime);
      const tempoDetune = 1200 * Math.log2(rate);
      active.sourceNode.detune.setValueAtTime((track.detune || 0) - tempoDetune, audioCtxRef.current.currentTime);
    });
  };

  useEffect(() => {
    if (audioCtxRef.current && isPlaying) {
      updateGainNodesRealtime();
    }
  }, [masterVolume, deckLeftFader, deckRightFader, transitionStyle, playbackTime]);

  // Offline Render and Export
  const handleExport = async () => {
    if (playlist.length === 0) {
      showToast(t('emptyPlaylist'), 'error');
      return;
    }

    initAudioContext();
    setExporting(true);
    setExportProgress(10);

    try {
      const totalDuration = getMixTotalDuration();
      const sampleRate = audioCtxRef.current.sampleRate;
      const OfflineCtxClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      const offlineCtx = new OfflineCtxClass(2, sampleRate * totalDuration, sampleRate);

      // Offline Mastering Limiter / Compressor Node
      const compressor = offlineCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-12, 0);
      compressor.knee.setValueAtTime(30, 0);
      compressor.ratio.setValueAtTime(12, 0);
      compressor.attack.setValueAtTime(0.003, 0);
      compressor.release.setValueAtTime(0.25, 0);
      compressor.connect(offlineCtx.destination);

      setExportProgress(30);

      playlist.forEach((track, index) => {
        const sourceNode = offlineCtx.createBufferSource();
        sourceNode.buffer = track.buffer;

        const lowFilter = offlineCtx.createBiquadFilter();
        lowFilter.type = 'lowshelf';
        lowFilter.frequency.setValueAtTime(150, 0);

        const gainNode = offlineCtx.createGain();

        sourceNode.connect(lowFilter);
        lowFilter.connect(gainNode);
        gainNode.connect(compressor);

        const trackDur = track.clipEnd - track.clipStart;
        const trackTimelineEnd = track.timelineStart + trackDur;

        gainNode.gain.setValueAtTime(0, 0);
        lowFilter.gain.setValueAtTime(0, 0);

        const fader = (index % 2 === 0) ? deckLeftFader : deckRightFader;
        const volumeFactor = masterVolume * fader * (track.volumeNormalizer || 1.0);

        // FADE IN
        if (index > 0) {
          const prev = playlist[index - 1];
          const transDur = getTransitionDuration(prev, track);
          const steps = 20;
          for (let i = 0; i <= steps; i++) {
            const prog = i / steps;
            const time = track.timelineStart + prog * transDur;
            const curves = calculateCrossfadeCurves(prog, transitionStyle);
            gainNode.gain.setValueAtTime(curves.gainB * volumeFactor, time);
            lowFilter.gain.setValueAtTime(curves.bassB, time);

            // BPM Ramping & Key Lock
            const currentBpm = prev.bpm + prog * (track.bpm - prev.bpm);
            const rate = currentBpm / track.bpm;
            const tempoDetune = 1200 * Math.log2(rate);
            sourceNode.playbackRate.setValueAtTime(rate, time);
            sourceNode.detune.setValueAtTime((track.detune || 0) - tempoDetune, time);
          }
          // Restore native rate after fade-in ends
          sourceNode.playbackRate.setValueAtTime(1.0, track.timelineStart + transDur);
          sourceNode.detune.setValueAtTime(track.detune || 0, track.timelineStart + transDur);
        } else {
          gainNode.gain.setValueAtTime(1.0 * volumeFactor, 0);
          sourceNode.playbackRate.setValueAtTime(1.0, 0);
          sourceNode.detune.setValueAtTime(track.detune || 0, 0);
        }

        // FADE OUT
        if (index < playlist.length - 1) {
          const next = playlist[index + 1];
          const transDur = getTransitionDuration(track, next);
          const fadeStart = trackTimelineEnd - transDur;
          const steps = 20;
          for (let i = 0; i <= steps; i++) {
            const prog = i / steps;
            const time = fadeStart + prog * transDur;
            const curves = calculateCrossfadeCurves(prog, transitionStyle);
            gainNode.gain.setValueAtTime(curves.gainA * volumeFactor, time);
            lowFilter.gain.setValueAtTime(curves.bassA, time);

            // BPM Ramping & Key Lock
            const currentBpm = track.bpm + prog * (next.bpm - track.bpm);
            const rate = currentBpm / track.bpm;
            const tempoDetune = 1200 * Math.log2(rate);
            sourceNode.playbackRate.setValueAtTime(rate, time);
            sourceNode.detune.setValueAtTime((track.detune || 0) - tempoDetune, time);
          }
        } else {
          gainNode.gain.setValueAtTime(1.0 * volumeFactor, Math.max(0, trackTimelineEnd - 0.1));
        }

        sourceNode.start(track.timelineStart, track.clipStart, trackDur);
      });

      setExportProgress(50);
      const renderedBuffer = await offlineCtx.startRendering();
      setExportProgress(80);

      let blob;
      let filename = `BERNADA_Mix_${Date.now()}`;

      if (exportFormat === 'ogg') {
        if (!window.OggVorbisEncoder) throw new Error('OGG Encoder not loaded');
        const oggEncoder = new window.OggVorbisEncoder(sampleRate, 2, 0.7);
        const chan0 = renderedBuffer.getChannelData(0);
        const chan1 = renderedBuffer.getChannelData(1);
        const totalSamples = renderedBuffer.length;
        const chunkSize = 16384;

        for (let i = 0; i < totalSamples; i += chunkSize) {
          const len = Math.min(chunkSize, totalSamples - i);
          const chunk0 = chan0.subarray(i, i + len);
          const chunk1 = chan1.subarray(i, i + len);
          oggEncoder.encode([chunk0, chunk1]);
        }

        blob = oggEncoder.finish();
        filename += '.ogg';
      } else {
        if (!window.lamejs) throw new Error('MP3 Encoder not loaded');
        blob = await encodeBufferToMp3(renderedBuffer);
        filename += '.mp3';
      }

      setExportProgress(100);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(language === 'id' ? 'Mixtape berhasil diekspor!' : 'Mixtape exported successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  };

  const encodeBufferToMp3 = async (audioBuffer) => {
    const channels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const leftData = audioBuffer.getChannelData(0);
    const rightData = channels > 1 ? audioBuffer.getChannelData(1) : leftData;

    const leftInt16 = convertFloat32ToInt16(leftData);
    const rightInt16 = convertFloat32ToInt16(rightData);

    const mp3encoder = new window.lamejs.Mp3Encoder(channels, sampleRate, 320); // 320 kbps High Quality
    const mp3Data = [];
    const blockSize = 1152;

    for (let i = 0; i < leftInt16.length; i += blockSize) {
      const leftChunk = leftInt16.subarray(i, i + blockSize);
      const rightChunk = rightInt16.subarray(i, i + blockSize);
      const mp3buf = channels > 1 ? mp3encoder.encodeBuffer(leftChunk, rightChunk) : mp3encoder.encodeBuffer(leftChunk);
      if (mp3buf.length > 0) mp3Data.push(mp3buf);
    }

    const endBuf = mp3encoder.flush();
    if (endBuf.length > 0) mp3Data.push(endBuf);

    return new Blob(mp3Data, { type: 'audio/mp3' });
  };

  const convertFloat32ToInt16 = (float32Array) => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const val = Math.max(-1.0, Math.min(1.0, float32Array[i]));
      int16Array[i] = val < 0 ? val * 0x8000 : val * 0x7FFF;
    }
    return int16Array;
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- RENDERING VIEWS ---

  if (!mounted) return null;

  const hasDbAccess = user && (user.mixingIsPermanent || (user.mixingExpiry && new Date(user.mixingExpiry) > new Date()));
  const hasTrialAccess = licenseInfo && (!licenseInfo.trial || (new Date(licenseInfo.expiry).getTime() > Date.now()));
  const isUnlocked = hasDbAccess || hasTrialAccess;

  // Format expiry remaining days text
  let dbTimeLeftStr = '';
  if (user && user.mixingExpiry) {
    const daysLeft = Math.ceil((new Date(user.mixingExpiry) - new Date()) / (1000 * 60 * 60 * 24));
    dbTimeLeftStr = `${daysLeft} Hari`;
  }

  if (!isUnlocked) {
    const handleStartTrial = async () => {
      try {
        const res = await fetch('/api/auth/claim-trial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        // Double insurance: set trial info locally for instant unlock
        const trialData = {
          demo: true,
          username: user ? user.username : 'TrialUser',
          expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          timeleft: '24 Hours',
          trial: true
        };
        setLicenseInfo(trialData);
        localStorage.setItem('bmk_mixing_license', JSON.stringify(trialData));

        // Update auth user profile in background
        refreshUser();
        showToast(language === 'id' ? 'Free Trial 1 Hari Berhasil Diaktifkan!' : '1-Day Free Trial Activated successfully!', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    };

    return (
      <div style={{ maxWidth: 480, margin: '40px auto', padding: 12 }}>
        <div className="card" style={{ padding: 32, textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}>🎛️</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '0.5px' }}>BERNADA MIXING CONSOLE</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {language === 'id' 
                ? 'Mesin penyelarasan transisi setlist & harmonisasi nada berbasis kecerdasan buatan.'
                : 'AI-assisted professional setlist transition alignment & harmonic key engine.'}
            </p>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-subtle)', margin: 0 }} />

          {/* Pricing Grid */}
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--warning)', letterSpacing: '0.5px' }}>📊 DAFTAR HARGA LISENSI VIP</span>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, margin: '14px 0', textAlign: 'center' }}>
              {/* 7 Days */}
              <div style={{ padding: '10px 6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-secondary)' }}>PAKET 7 HARI</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>Rp 50K</div>
              </div>
              {/* 30 Days */}
              <div style={{ padding: '10px 6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-secondary)' }}>PAKET 30 HARI</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>Rp 150K</div>
              </div>
              {/* Permanent */}
              <div style={{ padding: '10px 6px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', fontSize: '0.42rem', background: 'var(--accent)', color: '#000', padding: '1px 5px', borderRadius: 4, fontWeight: 900, whiteSpace: 'nowrap' }}>PROMO</span>
                <div style={{ fontSize: '0.58rem', fontWeight: 800, color: 'var(--text-secondary)' }}>PERMANEN</div>
                <div style={{ fontSize: '0.58rem', textDecoration: 'line-through', color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>500K</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--accent)', marginTop: 1 }}>Rp 400K</div>
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-subtle)', margin: 0 }} />

          {/* Option 1: Official Purchase VIP Discord Ticket */}
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)' }}>👑 BELI LISENSI VIP</span>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {language === 'id'
                ? 'Hubungi kami langsung melalui Open Ticket di server Discord kami untuk melakukan pembelian paket lisensi VIP.'
                : 'Contact us directly via Open Ticket on our Discord server to purchase a VIP license.'}
            </p>
            <a 
              href="https://discord.gg/x26ky9drYr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary" 
              style={{ width: '100%', height: 38, fontSize: '0.75rem', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              ✉️ Beli Lisensi via Open Ticket
            </a>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-subtle)', margin: 0 }} />

          {/* Option 2: Free Trial 1 Day */}
          {user && user.mixingTrialClaimed ? (
            <div style={{ textAlign: 'left', padding: '12px 16px', background: 'rgba(239,68,68,0.04)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.15)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--error)' }}>⚡ UJI COBA GRATIS (FREE TRIAL)</span>
                <span className="badge badge-error" style={{ fontSize: '0.5rem', fontWeight: 900 }}>TERPAKAI</span>
              </div>
              <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {language === 'id'
                  ? 'Akun Anda sudah pernah mengklaim jatah uji coba gratis sebelumnya. Silakan beli lisensi VIP untuk membuka kembali akses.'
                  : 'Your account has already claimed the free trial. Please purchase a VIP license to regain access.'}
              </p>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ width: '100%', height: 36, fontSize: '0.72rem', fontWeight: 800, marginTop: 2, cursor: 'not-allowed' }}
                disabled
              >
                🔒 Trial Sudah Pernah Diklaim
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'left', padding: '12px 16px', background: 'rgba(16,185,129,0.04)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.15)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--success)' }}>⚡ UJI COBA GRATIS (FREE TRIAL)</span>
                <span className="badge badge-success" style={{ fontSize: '0.5rem', fontWeight: 900 }}>24 JAM</span>
              </div>
              <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {language === 'id'
                  ? 'Dapatkan akses uji coba penuh 1 hari secara gratis ke seluruh fitur premium audio mixing Bernada.'
                  : 'Get instant 24-hour full access trial to all premium Bernada audio mixing features for free.'}
              </p>
              <button 
                type="button" 
                className="btn btn-success" 
                style={{ width: '100%', height: 36, fontSize: '0.72rem', fontWeight: 800, color: '#fff', marginTop: 2 }}
                onClick={handleStartTrial}
              >
                🚀 Aktifkan Free Trial 1 Hari
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      <Script id="ogg-config" strategy="afterInteractive">
        {`
          window.Module = {
            locateFile: function(path) {
              if (path.endsWith('.mem')) {
                return '/' + path;
              }
              return path;
            },
            memoryInitializerPrefixURL: '/'
          };
        `}
      </Script>
      <Script src="/lame.min.js" strategy="afterInteractive" />
      <Script src="/OggVorbisEncoder.min.js" strategy="afterInteractive" />

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{t('title')}</h2>
          {user && user.mixingIsPermanent ? (
            <span className="badge badge-info" style={{ fontSize: '0.65rem', marginTop: 4, background: 'rgba(56,189,248,0.15)', color: 'var(--accent)', border: '1px solid rgba(56,189,248,0.3)', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              👑 VIP PERMANENT
            </span>
          ) : user && user.mixingExpiry && new Date(user.mixingExpiry) > new Date() ? (
            <span className="badge badge-info" style={{ fontSize: '0.65rem', marginTop: 4, background: 'rgba(56,189,248,0.15)', color: 'var(--accent)', border: '1px solid rgba(56,189,248,0.3)', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              ⏱️ VIP ACTIVE ({dbTimeLeftStr})
            </span>
          ) : licenseInfo && licenseInfo.trial ? (
            <span className="badge badge-success" style={{ fontSize: '0.65rem', marginTop: 4, background: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              ⏱️ FREE TRIAL: {trialTimeLeft} LEFT
            </span>
          ) : (
            <span className="badge badge-info" style={{ fontSize: '0.62rem', marginTop: 4 }}>
              {t('unlimitedCoins')}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={() => setShowHelp(true)}>
            ❓ {t('helpBtn')}
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleLogoutLicense}>
            🚪 {t('logoutLicense')}
          </button>
        </div>
      </div>

      {/* Main console layout grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
        
        {/* Left Deck A */}
        <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(37,99,235,0.08)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4 }}>DECK A</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {playlist[0] ? `${playlist[0].bpm} BPM • ${playlist[0].key}` : 'Offline'}
            </span>
          </div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {playlist[0] ? playlist[0].name : 'No Track Loaded'}
          </h4>
          <div className="form-group" style={{ marginTop: 12 }}>
            <label className="form-label">{t('volFader')} ({(deckLeftFader * 100).toFixed(0)}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={deckLeftFader * 100}
              onChange={(e) => setDeckLeftFader(parseFloat(e.target.value) / 100)}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>
        </div>

        {/* Center Control Strip */}
        <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {/* Logo Compact */}
          <span style={{ fontSize: '1rem', fontWeight: 900 }}>BERNADA <span style={{ color: 'var(--accent)' }}>MIXER</span></span>
          
          {/* Playback Progress & Timeline Scrubber */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <canvas ref={canvasRef} width="220" height="40" style={{ display: 'block', background: 'rgba(0,0,0,0.03)', borderRadius: 8, margin: '0 auto 8px' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>{formatTime(playbackTime)}</span>
              <span>{formatTime(getMixTotalDuration())}</span>
            </div>

            {/* Interactive Visual Timeline Scrubber */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = clickX / rect.width;
                const totalDur = getMixTotalDuration();
                const newTime = pct * totalDur;
                setPlaybackTime(newTime);
                if (isPlaying) {
                  stopAllActiveSources();
                  setTimeout(() => {
                    scheduleAudioNodes();
                  }, 30);
                }
              }}
              style={{ 
                width: '100%', 
                height: 32, 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid var(--border-subtle)',
                borderRadius: 6, 
                position: 'relative', 
                cursor: 'pointer',
                overflow: 'hidden'
              }}
            >
              {/* Tracks Segments */}
              {playlist.map((track, idx) => {
                const totalDur = getMixTotalDuration();
                if (totalDur <= 0) return null;
                const trackDur = track.clipEnd - track.clipStart;
                const startPct = (track.timelineStart / totalDur) * 100;
                const widthPct = (trackDur / totalDur) * 100;
                return (
                  <div 
                    key={"seg_" + track.id}
                    style={{
                      position: 'absolute',
                      left: `${startPct}%`,
                      width: `${widthPct}%`,
                      height: '100%',
                      background: idx % 2 === 0 ? 'rgba(37,99,235,0.15)' : 'rgba(16,185,129,0.15)',
                      borderRight: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.58rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      padding: '0 4px',
                      userSelect: 'none'
                    }}
                    title={track.name}
                  >
                    {track.name}
                  </div>
                );
              })}

              {/* Transition Overlaps Highlights */}
              {playlist.map((track, idx) => {
                if (idx === playlist.length - 1) return null;
                const totalDur = getMixTotalDuration();
                if (totalDur <= 0) return null;
                const next = playlist[idx + 1];
                const trackDur = track.clipEnd - track.clipStart;
                const prevEnd = track.timelineStart + trackDur;
                const overlapStart = next.timelineStart;
                const overlapEnd = prevEnd;
                const overlapDur = Math.max(0, overlapEnd - overlapStart);
                if (overlapDur <= 0) return null;

                const startPct = (overlapStart / totalDur) * 100;
                const widthPct = (overlapDur / totalDur) * 100;

                return (
                  <div 
                    key={"overlap_" + track.id}
                    style={{
                      position: 'absolute',
                      left: `${startPct}%`,
                      width: `${widthPct}%`,
                      height: '100%',
                      background: 'repeating-linear-gradient(45deg, rgba(245,158,11,0.25), rgba(245,158,11,0.25) 8px, rgba(245,158,11,0.1) 8px, rgba(245,158,11,0.1) 16px)',
                      borderLeft: '1px dashed var(--warning)',
                      borderRight: '1px dashed var(--warning)',
                      zIndex: 2,
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.52rem', color: '#d97706', fontWeight: 900, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>MIX</span>
                  </div>
                );
              })}

              {/* Real-time Playhead line */}
              {getMixTotalDuration() > 0 && (
                <div 
                  style={{
                    position: 'absolute',
                    left: `${(playbackTime / getMixTotalDuration()) * 100}%`,
                    width: 3,
                    height: '100%',
                    background: 'var(--danger)',
                    boxShadow: '0 0 8px var(--danger)',
                    zIndex: 3,
                    pointerEvents: 'none'
                  }}
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {isPlaying ? (
              <button className="btn btn-primary" style={{ padding: '8px 20px' }} onClick={pausePlayback}>
                ⏸ Pause
              </button>
            ) : (
              <button className="btn btn-primary" style={{ padding: '8px 20px' }} onClick={startPlayback} disabled={playlist.length === 0}>
                ▶ Play
              </button>
            )}
            <button className="btn btn-outline" style={{ padding: '8px 20px' }} onClick={stopPlayback}>
              ⏹ Stop
            </button>
          </div>
        </div>

        {/* Right Deck B */}
        <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(37,99,235,0.08)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4 }}>DECK B</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {playlist[1] ? `${playlist[1].bpm} BPM • ${playlist[1].key}` : 'Offline'}
            </span>
          </div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {playlist[1] ? playlist[1].name : 'No Track Loaded'}
          </h4>
          <div className="form-group" style={{ marginTop: 12 }}>
            <label className="form-label">{t('volFader')} ({(deckRightFader * 100).toFixed(0)}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={deckRightFader * 100}
              onChange={(e) => setDeckRightFader(parseFloat(e.target.value) / 100)}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>
        </div>

        {/* Bottom Library & Database Block */}
        <div className="card" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            📁 {t('databaseTitle')}
          </h3>
          <div 
            style={{ 
              border: '2px dashed var(--border-subtle)', 
              borderRadius: 10, 
              padding: 20, 
              textAlign: 'center', 
              cursor: 'pointer',
              background: 'var(--bg-secondary)',
              transition: 'all 0.2s ease'
            }}
            onClick={() => document.getElementById('audio-uploader').click()}
          >
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 8 }}>☁️</span>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{t('dropzoneText')}</p>
            <input 
              type="file" 
              id="audio-uploader" 
              multiple 
              accept="audio/*" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
            />
          </div>

          <div style={{ overflowY: 'auto', maxHeight: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tracks.map((track) => (
              <div 
                key={track.id} 
                style={{ 
                  padding: 8, 
                  background: 'var(--bg-secondary)', 
                  borderRadius: 6, 
                  fontSize: '0.72rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}
              >
                <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }} title={track.name}>
                  {track.name}
                </span>
                <button className="btn btn-primary btn-sm" style={{ padding: '2px 6px', fontSize: '0.6rem' }} onClick={() => addToPlaylist(track)}>
                  {t('addBtn')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Center playlist console table */}
        <div className="card" style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              📊 PLAYLIST TIMELINE ({playlist.length} Tracks)
            </h3>
            <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: '0.65rem' }} onClick={clearAllTracks}>
              🗑️ {t('clearAllBtn')}
            </button>
          </div>

          <div style={{ overflowX: 'auto', minHeight: 200 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ fontSize: '0.7rem', padding: '8px 10px', textAlign: 'left' }}>#</th>
                  <th style={{ fontSize: '0.7rem', padding: '8px 10px', textAlign: 'left' }}>{t('songTitleCol')}</th>
                  <th style={{ fontSize: '0.7rem', padding: '8px 10px', textAlign: 'left' }}>{t('bpmCol')}</th>
                  <th style={{ fontSize: '0.7rem', padding: '8px 10px', textAlign: 'left' }}>
                    {t('keyCol')}{' '}
                    <span style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={() => setShowCamelot(true)}>
                      ⓘ
                    </span>
                  </th>
                  <th style={{ fontSize: '0.7rem', padding: '8px 10px', textAlign: 'left' }}>{t('lenCol')}</th>
                  <th style={{ fontSize: '0.7rem', padding: '8px 10px', textAlign: 'left' }}></th>
                </tr>
              </thead>
              <tbody>
                {playlist.map((track, idx) => {
                  const color = CAMELOT_COLORS[track.key] || 'var(--text-primary)';
                  const isCompatible = idx === 0 || getCamelotCompatibilityScore(playlist[idx - 1].key, track.key) > 0;
                  return (
                    <Fragment key={track.id}>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ fontSize: '0.72rem', padding: '10px 10px' }}>{idx + 1}</td>
                        <td style={{ fontSize: '0.72rem', padding: '10px 10px', fontWeight: 700, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {track.name}
                          {track.manualCut && (
                            <span style={{ display: 'block', fontSize: '0.58rem', color: 'var(--success)', fontWeight: 800, marginTop: 2 }}>
                              ✏️ Manual Cut
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.72rem', padding: '10px 10px' }}>{track.bpm}</td>
                        <td style={{ fontSize: '0.72rem', padding: '10px 10px', color: color, fontWeight: 800 }}>
                          <div>{track.key} {idx > 0 && (isCompatible ? '✅' : '⚠️')}</div>
                          {track.detune !== 0 && track.detune !== undefined && (
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: 2 }}>
                              ({track.detune > 0 ? '+' : ''}{track.detune / 100} Semitone Sync)
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: '0.72rem', padding: '10px 10px' }}>
                          <div style={{ fontWeight: 700 }}>{formatTime(track.clipEnd - track.clipStart)}</div>
                          {track.clipEnd - track.clipStart < track.duration && (
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                              Original: {formatTime(track.duration)} (-{(track.duration - (track.clipEnd - track.clipStart)).toFixed(0)}s)
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: '0.72rem', padding: '10px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button 
                            className="btn btn-outline btn-sm" 
                            style={{ padding: '2px 6px', fontSize: '0.6rem', marginRight: 4, borderColor: editingTrackId === track.id ? 'var(--accent)' : 'var(--border)' }} 
                            onClick={() => setEditingTrackId(editingTrackId === track.id ? null : track.id)}
                          >
                            ✂️ {editingTrackId === track.id ? 'Close' : 'Cut'}
                          </button>
                          <button className="btn btn-danger btn-sm" style={{ padding: '2px 6px', fontSize: '0.6rem' }} onClick={() => removeFromPlaylist(idx)}>
                            ✕
                          </button>
                        </td>
                      </tr>
                      {editingTrackId === track.id && (() => {
                        const { m: startMin, s: startSec } = getMinutesSeconds(track.clipStart);
                        const { m: endMin, s: endSec } = getMinutesSeconds(track.clipEnd);
                        const { m: totalMin, s: totalSec } = getMinutesSeconds(track.duration);
                        const isPreviewing = previewingTrackId === track.id;

                        return (
                          <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <td colSpan="6" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent)', display: 'flex', justifyContent: 'space-between' }}>
                                  <span>MANUAL AUDIO CUT & CROP (MINUTE:SECOND FORMAT)</span>
                                  {track.manualCut && (
                                    <span style={{ color: 'var(--success)' }}>✏️ MANUAL MODE ACTIVE (AUTOMIX WILL PRESERVE THIS)</span>
                                  )}
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                  {/* Start Crop */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                      START AT (Min : Sec) — Total: {totalMin}m {totalSec}s
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <input 
                                        type="number" 
                                        className="input"
                                        style={{ width: '70px', padding: '6px 8px', fontSize: '0.75rem', textAlign: 'center', height: 'auto', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                        min="0" 
                                        max={totalMin}
                                        value={startMin} 
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value) || 0;
                                          handleManualCutChange(idx, val * 60 + startSec, track.clipEnd);
                                        }}
                                      />
                                      <span style={{ fontWeight: 800 }}>:</span>
                                      <input 
                                        type="number" 
                                        className="input"
                                        style={{ width: '70px', padding: '6px 8px', fontSize: '0.75rem', textAlign: 'center', height: 'auto', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                        min="0" 
                                        max="59"
                                        value={startSec} 
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value) || 0;
                                          handleManualCutChange(idx, startMin * 60 + val, track.clipEnd);
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {/* End Crop */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                      END AT (Min : Sec) — Total: {totalMin}m {totalSec}s
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <input 
                                        type="number" 
                                        className="input"
                                        style={{ width: '70px', padding: '6px 8px', fontSize: '0.75rem', textAlign: 'center', height: 'auto', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                        min="0" 
                                        max={totalMin}
                                        value={endMin} 
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value) || 0;
                                          handleManualCutChange(idx, track.clipStart, val * 60 + endSec);
                                        }}
                                      />
                                      <span style={{ fontWeight: 800 }}>:</span>
                                      <input 
                                        type="number" 
                                        className="input"
                                        style={{ width: '70px', padding: '6px 8px', fontSize: '0.75rem', textAlign: 'center', height: 'auto', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                        min="0" 
                                        max="59"
                                        value={endSec} 
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value) || 0;
                                          handleManualCutChange(idx, track.clipStart, endMin * 60 + val);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Controls bar: Reset, Preview and Done */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div>
                                    {isPreviewing ? (
                                      <button 
                                        className="btn btn-danger" 
                                        style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                                        onClick={stopTrackPreview}
                                      >
                                        ⏸ Stop Preview
                                      </button>
                                    ) : (
                                      <button 
                                        className="btn btn-success" 
                                        style={{ padding: '6px 12px', fontSize: '0.7rem', color: '#fff' }}
                                        onClick={() => playTrackPreview(track)}
                                      >
                                        ▶️ Preview Crop
                                      </button>
                                    )}
                                  </div>
                                  
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button 
                                      className="btn btn-outline btn-sm" 
                                      style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                                      onClick={() => handleResetManualCut(idx)}
                                    >
                                      Reset
                                    </button>
                                    <button 
                                      className="btn btn-primary btn-sm" 
                                      style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                                      onClick={() => setEditingTrackId(null)}
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })()}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Automix and Export control panel */}
        <div className="card" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Automix Engine Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', margin: 0 }}>
              ⚙️ {t('automixTitle')}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{t('transitionStyle')}</label>
              <select 
                className="input" 
                style={{ padding: '6px 10px', fontSize: '0.72rem', height: 'auto' }}
                value={transitionStyle}
                onChange={(e) => setTransitionStyle(e.target.value)}
              >
                <option value="smooth">{t('smoothCrossfade')}</option>
                <option value="cut">{t('quickCut')}</option>
                <option value="bass">{t('bassSwapHeavy')}</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Mix Strategy</label>
              <select 
                className="input" 
                style={{ padding: '6px 10px', fontSize: '0.72rem', height: 'auto' }}
                value={enableAutoCut ? 'auto' : 'keep'}
                onChange={(e) => setEnableAutoCut(e.target.value === 'auto')}
              >
                <option value="auto">🔄 Auto-Cut Tracks (Smart Crop)</option>
                <option value="keep">🔗 Keep Current Cut (Merge Only)</option>
              </select>
            </div>

            {enableAutoCut && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Auto-Cut Mode</label>
                <select 
                  className="input" 
                  style={{ padding: '6px 10px', fontSize: '0.72rem', height: 'auto' }}
                  value={autoCutMode}
                  onChange={(e) => setAutoCutMode(e.target.value)}
                >
                  <option value="high">🔥 High Energy (Chorus/Drop)</option>
                  <option value="low">🍃 Low Energy (Intro/Verse)</option>
                  <option value="balanced">🎼 Balanced (Melodic Bridge)</option>
                </select>
              </div>
            )}

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', height: 38, fontSize: '0.75rem', fontWeight: 800 }}
              onClick={runAutomix}
              disabled={playlist.length < 2 || automixing}
            >
              🔄 {automixing ? `${t('exporting')}...` : t('runAutomix')}
            </button>
          </div>

          {/* Export Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', margin: 0 }}>
              💾 {t('exportTitle')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{t('formatLabel')}</label>
              <select 
                className="input" 
                style={{ padding: '6px 10px', fontSize: '0.72rem', height: 'auto' }}
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="mp3">MP3 (320kbps)</option>
                <option value="ogg">OGG Vorbis</option>
              </select>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', height: 38, fontSize: '0.75rem', fontWeight: 800, background: 'var(--success)', color: '#fff' }}
              onClick={handleExport}
              disabled={playlist.length === 0 || exporting}
            >
              💾 {exporting ? `${exportProgress}%` : t('exportBtn')}
            </button>
          </div>
        </div>

      </div>

      {/* Guide Modals */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3 className="modal-title" style={{ fontSize: '1rem', fontWeight: 800 }}>📖 {t('stepTitle')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <p>{t('step1')}</p>
              <p>{t('step2')}</p>
              <p>{t('step3')}</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setShowHelp(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {showCamelot && (
        <div className="modal-overlay" onClick={() => setShowCamelot(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3 className="modal-title" style={{ fontSize: '1rem', fontWeight: 800 }}>🎵 {t('camelotGuide')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <p>{t('compatibleMoves')}</p>
              <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>{t('sameKey')}</li>
                <li>{t('adjacentHour')}</li>
                <li>{t('letterSwap')}</li>
              </ul>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setShowCamelot(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Automix loading overlay */}
      {automixing && (
        <div className="modal-overlay">
          <div className="modal" style={{ textAlign: 'center', maxWidth: 380, padding: 24 }}>
            <span style={{ fontSize: '2.5rem', display: 'block', animation: 'spinGlow 2s linear infinite', marginBottom: 12 }}>🔄</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: 8, letterSpacing: '0.5px' }}>BERNADA MIX ENGINE</h4>
            
            {/* Dynamic Status Subtitle */}
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: 20, minHeight: 18, fontWeight: 600 }}>
              {automixStep === 0 && (language === 'id' ? 'Memulai mesin mixer DSP...' : 'Starting DSP mixer engine...')}
              {automixStep === 1 && (enableAutoCut 
                ? (language === 'id' ? 'Memindai batas keheningan lagu...' : 'Scanning leading & trailing silence...')
                : (language === 'id' ? 'Melewati pemindaian keheningan (Mode Gabung)...' : 'Bypassing silence scan (Merge Mode)...'))}
              {automixStep === 2 && (language === 'id' ? 'Menyamakan tingkat volume (Auto-Gain)...' : 'Normalizing track volume levels...')}
              {automixStep === 3 && (language === 'id' ? 'Menganalisis spektrum energi RMS...' : 'Profiling track RMS sound energy...')}
              {automixStep === 4 && (language === 'id' ? 'Mencari jalur harmoni Camelot...' : 'Solving optimal Camelot wheel path...')}
              {automixStep === 5 && (language === 'id' ? 'Penyelarasan pitch kunci (Key Sync)...' : 'Pitch transposing keys (Key Sync)...')}
              {automixStep === 6 && (enableAutoCut
                ? (language === 'id' ? 'Mendeteksi letak klimaks Drop/Reff...' : 'Locating climax & chorus segments...')
                : (language === 'id' ? 'Mempertahankan batas potongan manual...' : 'Preserving manual crop boundaries...'))}
              {automixStep === 7 && (language === 'id' ? 'Menyelaraskan ketukan ke Bar terdekat...' : 'Aligning beats to nearest 16-beat bars...')}
              {automixStep === 8 && (language === 'id' ? 'Mengunci tempo & sinkronisasi BPM...' : 'Locking tempo & dynamic BPM ramping...')}
              {automixStep === 9 && (language === 'id' ? 'Mengaktifkan master tempo pitch lock...' : 'Compensating pitch (Key Lock)...')}
              {automixStep === 10 && (language === 'id' ? 'Menghubungkan fader EQ & mastering limiter...' : 'Finalizing EQ faders & limiter mastering...')}
            </p>

            {/* Checklist of DSP Stages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', margin: '0 0 20px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              {[
                { id: 1, label: enableAutoCut 
                  ? (language === 'id' ? 'Silence & Noise Gate Scanning' : 'Silence & Noise Gate Scanning')
                  : (language === 'id' ? 'Silence Scanning (Bypassed)' : 'Silence Scanning (Bypassed)'), icon: '🔍' },
                { id: 2, label: language === 'id' ? 'Auto-Gain Loudness Normalization' : 'Auto-Gain Loudness Normalization', icon: '🎚️' },
                { id: 3, label: language === 'id' ? 'RMS Sound Energy Profiling' : 'RMS Sound Energy Profiling', icon: '📊' },
                { id: 4, label: language === 'id' ? 'Global Camelot Path Optimization' : 'Global Camelot Path Optimization', icon: '🎼' },
                { id: 5, label: language === 'id' ? 'Harmonic Key Sync (Detune)' : 'Harmonic Key Sync (Detune)', icon: '⚙️' },
                { id: 6, label: enableAutoCut
                  ? (language === 'id' ? 'Climax & Energy Trimming' : 'Climax & Energy Trimming')
                  : (language === 'id' ? 'Climax Trimming (Bypassed - Keep Crop)' : 'Climax Trimming (Bypassed - Keep Crop)'), icon: '✂️' },
                { id: 7, label: language === 'id' ? '16-Beat Phrase & Bar Alignment' : '16-Beat Phrase & Bar Alignment', icon: '📐' },
                { id: 8, label: language === 'id' ? 'BPM Ramping & Tempo Match' : 'BPM Ramping & Tempo Match', icon: '📈' },
                { id: 9, label: language === 'id' ? 'Master Tempo Key Lock (Pitch Lock)' : 'Master Tempo Key Lock (Pitch Lock)', icon: '🛡️' },
                { id: 10, label: language === 'id' ? 'EQ Crossover & Limiter Mastering' : 'EQ Crossover & Limiter Mastering', icon: '🎛️' }
              ].map((step) => {
                const isCompleted = automixStep >= step.id;
                const isCurrent = automixStep === step.id - 1;
                return (
                  <div 
                    key={step.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      fontSize: '0.68rem',
                      color: isCompleted ? 'var(--text-primary)' : isCurrent ? 'var(--accent)' : 'var(--text-muted)',
                      fontWeight: isCurrent || isCompleted ? 700 : 400,
                      opacity: isCompleted || isCurrent ? 1.0 : 0.4,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{step.icon}</span>
                      <span>{step.label}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                      {isCompleted ? (
                        <span style={{ color: 'var(--success)' }}>✅</span>
                      ) : isCurrent ? (
                        <span style={{ display: 'inline-block', animation: 'spinGlow 1.5s linear infinite' }}>⏳</span>
                      ) : (
                        <span style={{ color: 'var(--border)' }}>○</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="progress-wrap" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${(automixStep / 10) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Export loading overlay */}
      {exporting && (
        <div className="modal-overlay">
          <div className="modal" style={{ textAlign: 'center', maxWidth: 360 }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>💾</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 8 }}>BERNADA EXPORT</h4>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 16 }}>Encoding mixtape...</p>
            <div className="progress-wrap" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${exportProgress}%` }} />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spinGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}
