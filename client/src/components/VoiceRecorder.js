import React, { useEffect, useRef } from 'react';

const VoiceRecorder = ({ onRecordingComplete, isRecording, setIsRecording }) => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const RECORD_LIMIT = 15000; // 15 seconds

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        audioBitsPerSecond: 16000,
        mimeType: 'audio/webm;codecs=opus'
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus'
        });

        if (audioBlob.size > 500000) {
          alert('Recording too long. Please keep messages brief.');
          audioChunksRef.current = [];
          return;
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        onRecordingComplete(audioUrl);
        audioChunksRef.current = [];
        setIsRecording(false);
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);

      // Set recording limit
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, RECORD_LIMIT);

      // Start timer
      let timeLeft = RECORD_LIMIT / 1000;
      recordingTimerRef.current = setInterval(() => {
        if (!isRecording) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
          return;
        }
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (mediaRecorderRef.current) {
        const tracks = mediaRecorderRef.current.stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      className={`bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors relative ${
        isRecording ? 'bg-red-600' : ''
      }`}
      title={isRecording ? 'Stop Recording' : 'Start Recording'}
    >
      <i className="fas fa-microphone"></i>
      {isRecording && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></span>
      )}
    </button>
  );
};

export default VoiceRecorder; 