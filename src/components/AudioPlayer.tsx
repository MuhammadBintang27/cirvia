'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Download } from 'lucide-react'

interface AudioPlayerProps {
  title: string
  description?: string
  audioUrl?: string
  chapters?: Array<{
    title: string
    startTime: number
    duration: number
  }>
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  title, 
  description, 
  audioUrl,
  chapters = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [currentChapter, setCurrentChapter] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    const newVolume = parseFloat(e.target.value)
    
    if (audio) {
      audio.volume = newVolume
    }
    setVolume(newVolume)
  }

  const handlePlaybackRateChange = (rate: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.playbackRate = rate
    }
    setPlaybackRate(rate)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const skipToChapter = (chapterIndex: number) => {
    const audio = audioRef.current
    const chapter = chapters[chapterIndex]
    
    if (audio && chapter) {
      audio.currentTime = chapter.startTime
      setCurrentChapter(chapterIndex)
    }
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 15, duration)
    }
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 15, 0)
    }
  }

  // Demo audio URL (you can replace with actual NotebookLM generated audio)
  const demoAudioUrl = audioUrl || 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            🎙️ NotebookLM Audio
          </span>
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src={demoAudioUrl} preload="metadata" />

      {/* Main Controls */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={skipBackward}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <SkipBack size={20} />
        </button>
        
        <button
          onClick={togglePlayPause}
          className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button
          onClick={skipForward}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <SkipForward size={20} />
        </button>

        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(currentTime / duration) * 100}%, #E5E7EB ${(currentTime / duration) * 100}%, #E5E7EB 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Volume2 size={16} className="text-gray-600" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">Kecepatan:</span>
          {[0.75, 1, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => handlePlaybackRateChange(rate)}
              className={`px-2 py-1 text-xs rounded ${
                playbackRate === rate
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Chapters */}
      {chapters.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Bab Audio</h4>
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => skipToChapter(index)}
                className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                  currentChapter === index
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{chapter.title}</span>
                  <span className="text-xs text-gray-500">
                    {formatTime(chapter.startTime)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Download Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center space-x-2 p-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
          <Download size={16} />
          <span>Download Audio untuk Offline</span>
        </button>
      </div>
    </div>
  )
}

export default AudioPlayer
