import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { roomService } from '../services/roomService';
import { useToast } from '../context/ToastContext';
import { Music, Plus, Users, Lock, Unlock, Youtube, Video, Play, Pause, Loader2, Mic, MicOff, LogOut } from 'lucide-react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

export const VirtualParty: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { showToast } = useToast();

  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState<any>(null);

  // Video State
  const [videoId, setVideoId] = useState('');
  const [inputVideoUrl, setInputVideoUrl] = useState('');
  const playerRef = useRef<YouTubePlayer | null>(null);
  
  // Voice State (Mock UI for WebRTC for now to simulate connection)
  const [micEnabled, setMicEnabled] = useState(false);
  const [voiceConnected, setVoiceConnected] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch {
      showToast('Failed to load rooms', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    const name = window.prompt('Enter room name (e.g. Chill Beats & Brews):');
    if (!name) return;
    try {
      const room = await roomService.createRoom(name, 'public');
      setRooms([room, ...rooms]);
      handleJoinRoom(room._id);
    } catch {
      showToast('Failed to create room', 'error');
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      const res = await roomService.joinRoom(roomId);
      setActiveRoom(res.data);
      socket?.emit('room:join', res.data._id);
      
      // Simulate connecting voice
      setTimeout(() => setVoiceConnected(true), 1500);
      
      if (res.data.nowPlaying?.videoId) {
        setVideoId(res.data.nowPlaying.videoId);
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to join', 'error');
    }
  };

  const handleLeaveRoom = async () => {
    if (!activeRoom) return;
    try {
      await roomService.leaveRoom(activeRoom._id);
      socket?.emit('room:leave', activeRoom._id);
      setActiveRoom(null);
      setVideoId('');
      setVoiceConnected(false);
      loadRooms();
    } catch {
      showToast('Failed to leave room', 'error');
    }
  };

  // YouTube Sync logic
  useEffect(() => {
    if (!socket || !activeRoom) return;

    socket.on('room:user_joined', (user: any) => {
      showToast(`${user.buzzName} joined the party! 🎉`, 'info');
      setActiveRoom((prev: any) => prev ? { ...prev, participants: [...prev.participants, user] } : prev);
    });

    socket.on('room:user_left', (u: any) => {
      setActiveRoom((prev: any) => prev ? { ...prev, participants: prev.participants.filter((p: any) => p._id !== u.userId) } : prev);
    });

    socket.on('youtube:play', ({ videoId: vId, currentTime }) => {
      if (vId && vId !== videoId) setVideoId(vId);
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime);
        playerRef.current.playVideo();
      }
    });

    socket.on('youtube:pause', ({ currentTime }) => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime);
        playerRef.current.pauseVideo();
      }
    });

    return () => {
      socket.off('room:user_joined');
      socket.off('room:user_left');
      socket.off('youtube:play');
      socket.off('youtube:pause');
    };
  }, [socket, activeRoom, videoId]);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoom) return;
    const vId = extractVideoId(inputVideoUrl);
    if (vId) {
      setVideoId(vId);
      socket?.emit('youtube:play', { roomId: activeRoom._id, videoId: vId, currentTime: 0 });
      setInputVideoUrl('');
    } else {
      showToast('Invalid YouTube URL', 'error');
    }
  };

  const onPlayerReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    // If joining and there's a current time, seek to it
    if (activeRoom?.nowPlaying?.currentTime > 0) {
      playerRef.current?.seekTo(activeRoom.nowPlaying.currentTime);
      if (activeRoom.nowPlaying.isPlaying) playerRef.current?.playVideo();
    }
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    if (!activeRoom || !playerRef.current) return;
    
    // Only admin broadcasts state changes to prevent chaos
    if (activeRoom.admin._id !== user?._id && activeRoom.admin !== user?._id) return;

    const currentTime = playerRef.current.getCurrentTime();
    
    if (event.data === YouTube.PlayerState.PLAYING) {
      socket?.emit('youtube:play', { roomId: activeRoom._id, videoId, currentTime });
    } else if (event.data === YouTube.PlayerState.PAUSED) {
      socket?.emit('youtube:pause', { roomId: activeRoom._id, currentTime });
    }
  };

  if (activeRoom) {
    const isAdmin = activeRoom.admin._id === user?._id || activeRoom.admin === user?._id;

    return (
      <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen pb-16 md:pb-0">
        <div className="flex-1 bg-[#0a0600] flex flex-col md:flex-row overflow-hidden border border-white/5 md:m-4 rounded-2xl">
          
          {/* Main Stage (YouTube) */}
          <div className="flex-1 flex flex-col bg-black relative">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Music size={12} /> {activeRoom.name}
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Users size={12} /> {activeRoom.participants.length}
              </span>
            </div>
            
            <button onClick={handleLeaveRoom} className="absolute top-4 right-4 z-10 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 backdrop-blur-md border border-red-500/30">
              <LogOut size={12} /> Leave Party
            </button>

            <div className="flex-1 flex items-center justify-center p-4">
              {videoId ? (
                <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 pointer-events-auto">
                  <YouTube
                    videoId={videoId}
                    opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, controls: isAdmin ? 1 : 0 } }}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Youtube size={64} className="mx-auto mb-4 opacity-20" />
                  <p>No video playing.</p>
                  {isAdmin && <p className="text-sm mt-1">Add a YouTube link below to start the party!</p>}
                </div>
              )}
            </div>

            {isAdmin && (
              <form onSubmit={handleVideoSubmit} className="p-4 bg-white/5 border-t border-white/10 flex gap-2 backdrop-blur-xl">
                <input type="text" value={inputVideoUrl} onChange={e=>setInputVideoUrl(e.target.value)} placeholder="Paste YouTube URL to sync..." className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50" />
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
                  <Play size={14} /> Play
                </button>
              </form>
            )}
          </div>

          {/* Sidebar (Voice & Participants) */}
          <div className="w-full md:w-72 bg-[#110a02] border-l border-white/5 flex flex-col h-64 md:h-auto">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2"><Video size={16} className="text-amber-500"/> Room Activity</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {activeRoom.participants.map((p: any) => (
                <div key={p._id || p} className="flex items-center justify-between bg-white/5 rounded-xl p-2 pr-3 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <img src={p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.buzzName || p}`} className="w-8 h-8 rounded-full" alt="" />
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{p.buzzName || 'User'}</div>
                      {activeRoom.admin === p._id && <div className="text-[10px] text-amber-500 font-bold uppercase">DJ / Admin</div>}
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20">
              {voiceConnected ? (
                <button onClick={() => setMicEnabled(!micEnabled)} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${micEnabled ? 'bg-amber-500 text-black' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {micEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                  {micEnabled ? 'Mic On' : 'Mic Muted'}
                </button>
              ) : (
                <div className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-white/5 text-gray-400 border border-white/10">
                  <Loader2 size={16} className="animate-spin" /> Connecting Voice...
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Room List View
  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0 animate-in fade-in duration-300">
      <div className="sticky top-0 z-20 bg-[#0a0600]/80 backdrop-blur-md border-b border-white/5 pb-4 -mx-4 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Video className="text-amber-500" size={22} />
              <h1 className="text-xl font-bold tracking-tight">Virtual Parties</h1>
            </div>
            <p className="text-xs text-gray-400 mt-1">Join real-time voice & synchronized video rooms.</p>
          </div>
          <button onClick={handleCreateRoom} className="bg-amber-500 hover:bg-amber-400 text-black px-3 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
            <Plus size={16} /> <span className="hidden sm:inline">Start Room</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-amber-500" size={32} /></div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Music className="mx-auto mb-4 opacity-30" size={48} />
          <p className="font-medium">No active parties right now</p>
          <p className="text-sm mt-1">Start a room to invite your friends!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {rooms.map(room => (
            <div key={room._id} className="bg-[#110a02] border border-white/5 rounded-xl p-5 hover:border-amber-500/30 transition-all group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Music size={100} />
              </div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="font-bold text-white text-lg truncate pr-4">{room.name}</h3>
                {room.type === 'private' ? <Lock size={14} className="text-rose-500 flex-shrink-0"/> : <Unlock size={14} className="text-green-500 flex-shrink-0"/>}
              </div>

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <img src={room.admin?.avatar} className="w-8 h-8 rounded-full border border-amber-500/30" alt="" />
                <div>
                  <div className="text-xs text-gray-400">DJ / Host</div>
                  <div className="text-sm font-bold text-amber-500">{room.admin?.buzzName}</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-md">
                  <Users size={12} /> {room.participants.length} inside
                </div>
                <button onClick={() => handleJoinRoom(room._id)} className="text-white font-bold text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition-colors">
                  Join Party
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
