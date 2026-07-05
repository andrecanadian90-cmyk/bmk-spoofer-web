'use client';
import { useState, useEffect, useRef } from 'react';
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
  const { token } = useAuth();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // License State
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseInfo, setLicenseInfo] = useState(null);
  const [activating, setActivating] = useState(false);

  // Mixer State
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [deckLeftFader, setDeckLeftFader] = useState(1.0);
  const [deckRightFader, setDeckRightFader] = useState(1.0);
  const [transitionStyle, setTransitionStyle] = useState('smooth');
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
    setMounted(true);
    const savedLicense = localStorage.getItem('bmk_mixing_license');
    if (savedLicense) {
      try {
        setLicenseInfo(JSON.parse(savedLicense));
      } catch (e) {
        localStorage.removeItem('bmk_mixing_license');
      }
    }
  }, []);

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

  // KeyAuth activation handler
  const handleActivateLicense = async (e) => {
    if (e) e.preventDefault();
    if (!licenseKey.trim()) return;

    setActivating(true);
    try {
      const res = await fetch('/api/auth/keyauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'login', key: licenseKey.trim() })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setLicenseInfo(data.info);
      localStorage.setItem('bmk_mixing_license', JSON.stringify(data.info));
      showToast(t('licenseActive'), 'success');
    } catch (err) {
      showToast(err.message || t('invalidKey'), 'error');
    } finally {
      setActivating(false);
    }
  };

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
    analyserNode.connect(audioCtx.destination);
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

    initAudioContext();
    showToast(language === 'id' ? 'Mendecode audio...' : 'Decoding audio...', 'info');

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);

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
    return (32 / avgBpm) * 60; // 32 beats (8 bars)
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

  const recalculateTimeline = (list = playlist) => {
    let clock = 0;
    const updated = list.map((track, idx) => {
      if (idx === 0) {
        track.timelineStart = 0;
        clock = track.clipEnd - track.clipStart;
      } else {
        const prev = list[idx - 1];
        const overlap = getTransitionDuration(prev, track);
        track.timelineStart = Math.max(0, clock - overlap);
        clock = track.timelineStart + (track.clipEnd - track.clipStart);
      }
      return track;
    });
    setPlaylist(updated);
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
      const buffer = track.buffer;
      if (!buffer) return track;

      const duration = buffer.duration;
      let silenceStart = 0;
      let silenceEnd = duration;

      try {
        const data = buffer.getChannelData(0);
        const sampleRate = buffer.sampleRate;
        const checkLength = data.length;
        const step = Math.floor(sampleRate * 0.1); // 100ms steps

        // Scan leading silence
        for (let i = 0; i < checkLength; i += step) {
          let rms = 0;
          const end = Math.min(checkLength, i + step);
          for (let j = i; j < end; j++) {
            rms += data[j] * data[j];
          }
          rms = Math.sqrt(rms / (end - i));
          if (rms > 0.005) {
            silenceStart = i / sampleRate;
            break;
          }
        }

        // Scan trailing silence
        for (let i = checkLength - 1; i >= 0; i -= step) {
          let rms = 0;
          const start = Math.max(0, i - step);
          for (let j = start; j < i; j++) {
            rms += data[j] * data[j];
          }
          rms = Math.sqrt(rms / (i - start));
          if (rms > 0.005) {
            silenceEnd = i / sampleRate;
            break;
          }
        }
      } catch (e) {
        console.warn('Silence scanning failed:', e);
      }

      if (silenceEnd <= silenceStart) silenceEnd = duration;

      const activeDuration = silenceEnd - silenceStart;
      // DJ intro/outro crop (15s or 10% of track)
      const cropAmount = Math.min(15, activeDuration * 0.1);

      let start = silenceStart;
      let end = silenceEnd;

      if (list.length === 1) {
        start = silenceStart;
        end = silenceEnd;
      } else if (idx === 0) {
        // First track: trim outro only
        start = silenceStart;
        end = silenceEnd - cropAmount;
      } else if (idx === list.length - 1) {
        // Last track: trim intro only
        start = silenceStart + cropAmount;
        end = silenceEnd;
      } else {
        // Middle tracks: trim both intro and outro
        start = silenceStart + cropAmount;
        end = silenceEnd - cropAmount;
      }

      // Fallback
      if (end <= start + 2) {
        start = silenceStart;
        end = silenceEnd;
      }

      return {
        ...track,
        clipStart: parseFloat(start.toFixed(2)),
        clipEnd: parseFloat(end.toFixed(2))
      };
    });
  };

  const runAutomix = () => {
    if (playlist.length < 2) return;
    setAutomixing(true);
    setAutomixStep(0);

    const runSteps = async () => {
      // Simulate DSP solver stages
      for (let step = 1; step <= 5; step++) {
        await new Promise(r => setTimeout(r, 600));
        setAutomixStep(step);
      }

      // Sort logic
      const unvisited = [...playlist];
      const ordered = [];
      let current = unvisited.shift();
      ordered.push(current);

      while (unvisited.length > 0) {
        let bestIdx = -1;
        let bestScore = -100;

        for (let i = 0; i < unvisited.length; i++) {
          const candidate = unvisited[i];
          const keyScore = getCamelotCompatibilityScore(current.key, candidate.key);
          const bpmDiff = Math.abs(current.bpm - candidate.bpm);
          const bpmScore = Math.max(0, 10 - bpmDiff * 0.5);
          const totalScore = keyScore * 10 + bpmScore;

          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestIdx = i;
          }
        }
        current = unvisited.splice(bestIdx, 1)[0];
        ordered.push(current);
      }

      const cutOrdered = performAutoCut(ordered);
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

  const startPlayback = () => {
    initAudioContext();
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsPlaying(true);
    lastUpdateTimeRef.current = audioCtxRef.current.currentTime;
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
    sourceNode.start(0, track.clipStart + offset);

    activeSourcesRef.current[track.id] = { sourceNode, gainNode, lowFilterNode };
  };

  useEffect(() => {
    if (isPlaying) {
      scheduleAudioNodes();
    }
  }, [playbackTime, playlist, isPlaying]);

  // Update Gain Realtime
  const calculateCrossfadeCurves = (progress, style) => {
    if (style === 'cut') {
      return {
        gainA: progress < 0.5 ? 1.0 : 0.0,
        gainB: progress >= 0.5 ? 1.0 : 0.0,
        bassA: 0,
        bassB: 0
      };
    }
    if (style === 'bass') {
      return {
        gainA: Math.cos(progress * Math.PI / 2),
        gainB: Math.sin(progress * Math.PI / 2),
        bassA: progress < 0.5 ? 0 : -24,
        bassB: progress >= 0.5 ? 0 : -24
      };
    }
    // smooth
    return {
      gainA: Math.cos(progress * Math.PI / 2),
      gainB: Math.sin(progress * Math.PI / 2),
      bassA: 0,
      bassB: 0
    };
  };

  const updateGainNodesRealtime = () => {
    const current = playbackTime;
    playlist.forEach((track, index) => {
      const active = activeSourcesRef.current[track.id];
      if (!active) return;

      const trackDur = track.clipEnd - track.clipStart;
      const trackEnd = track.timelineStart + trackDur;
      const fader = (index % 2 === 0) ? deckLeftFader : deckRightFader;
      const volumeFactor = masterVolume * fader;

      let gain = 1.0;
      let bass = 0;

      // FADE IN
      if (index > 0 && current < track.timelineStart + getTransitionDuration(playlist[index - 1], track)) {
        const prev = playlist[index - 1];
        const transDur = getTransitionDuration(prev, track);
        const progress = (current - track.timelineStart) / transDur;
        const curves = calculateCrossfadeCurves(Math.max(0, Math.min(1, progress)), transitionStyle);
        gain = curves.gainB;
        bass = curves.bassB;
      }
      // FADE OUT
      else if (index < playlist.length - 1 && current > trackEnd - getTransitionDuration(track, playlist[index + 1])) {
        const next = playlist[index + 1];
        const transDur = getTransitionDuration(track, next);
        const progress = (trackEnd - current) / transDur; // 1 to 0
        const curves = calculateCrossfadeCurves(Math.max(0, Math.min(1, 1 - progress)), transitionStyle);
        gain = curves.gainA;
        bass = curves.bassA;
      }

      active.gainNode.gain.setValueAtTime(gain * volumeFactor, audioCtxRef.current.currentTime);
      active.lowFilterNode.gain.setValueAtTime(bass, audioCtxRef.current.currentTime);
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
        gainNode.connect(offlineCtx.destination);

        const trackDur = track.clipEnd - track.clipStart;
        const trackTimelineEnd = track.timelineStart + trackDur;

        gainNode.gain.setValueAtTime(0, 0);
        lowFilter.gain.setValueAtTime(0, 0);

        const fader = (index % 2 === 0) ? deckLeftFader : deckRightFader;
        const volumeFactor = masterVolume * fader;

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
          }
        } else {
          gainNode.gain.setValueAtTime(1.0 * volumeFactor, 0);
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
        oggEncoder.encode([renderedBuffer.getChannelData(0), renderedBuffer.getChannelData(1)]);
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

  if (!licenseInfo) {
    return (
      <div style={{ maxWidth: 440, margin: '60px auto', padding: 12 }}>
        <div className="card" style={{ padding: 32, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>🔑</span>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>{t('licenseTitle')}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 24 }}>{t('licenseSubtitle')}</p>

          <form onSubmit={handleActivateLicense} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input
              type="text"
              className="input input-mono"
              placeholder={t('licensePlaceholder')}
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              style={{ textAlign: 'center', fontWeight: 700 }}
              disabled={activating}
            />

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: 42 }} disabled={activating}>
              {activating ? t('activating') : t('activateBtn')}
            </button>
            
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ width: '100%', height: 42 }} 
              onClick={() => {
                const demoInfo = { demo: true, username: 'DemoUser', expiry: 'Test Mode', timeleft: 'Lifetime' };
                setLicenseInfo(demoInfo);
                localStorage.setItem('bmk_mixing_license', JSON.stringify(demoInfo));
              }}
              disabled={activating}
            >
              {t('demoBtn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Script elements for encoders loading */}
      <Script src="/lame.min.js" strategy="afterInteractive" />
      <Script src="/OggVorbisEncoder.min.js" strategy="afterInteractive" />

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{t('title')}</h2>
          <span className="badge badge-info" style={{ fontSize: '0.62rem', marginTop: 4 }}>
            {licenseInfo.demo ? 'DEMO MODE' : t('unlimitedCoins')}
          </span>
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
          
          {/* Playback Progress */}
          <div style={{ width: '100%' }}>
            <canvas ref={canvasRef} width="220" height="40" style={{ display: 'block', background: 'rgba(0,0,0,0.03)', borderRadius: 8, margin: '0 auto 8px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>{formatTime(playbackTime)}</span>
              <span>{formatTime(getMixTotalDuration())}</span>
            </div>
            <input 
              type="range"
              min="0"
              max={getMixTotalDuration() || 100}
              value={playbackTime}
              onChange={(e) => setPlaybackTime(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
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
                    <tr key={track.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ fontSize: '0.72rem', padding: '10px 10px' }}>{idx + 1}</td>
                      <td style={{ fontSize: '0.72rem', padding: '10px 10px', fontWeight: 700, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {track.name}
                      </td>
                      <td style={{ fontSize: '0.72rem', padding: '10px 10px' }}>{track.bpm}</td>
                      <td style={{ fontSize: '0.72rem', padding: '10px 10px', color: color, fontWeight: 800 }}>
                        {track.key} {idx > 0 && (isCompatible ? '✅' : '⚠️')}
                      </td>
                      <td style={{ fontSize: '0.72rem', padding: '10px 10px' }}>{formatTime(track.duration)}</td>
                      <td style={{ fontSize: '0.72rem', padding: '10px 10px', textAlign: 'right' }}>
                        <button className="btn btn-danger btn-sm" style={{ padding: '2px 6px', fontSize: '0.6rem' }} onClick={() => removeFromPlaylist(idx)}>
                          ✕
                        </button>
                      </td>
                    </tr>
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
          <div className="modal" style={{ textAlign: 'center', maxWidth: 360 }}>
            <span style={{ fontSize: '2.5rem', display: 'block', animation: 'spinGlow 2s linear infinite', marginBottom: 12 }}>🔄</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 8 }}>BERNADA MIX ENGINE</h4>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 16 }}>Solving Camelot key progression...</p>
            <div className="progress-wrap" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${(automixStep / 5) * 100}%` }} />
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
