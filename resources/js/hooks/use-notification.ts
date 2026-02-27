import { useCallback, useEffect, useRef } from 'react';

export type VibrationType = 'short' | 'long' | 'pulse' | 'success';

export interface NotifyOptions {
    withSound?: boolean;
    withVibration?: boolean;
    vibrationType?: VibrationType;
}

const SOUND_PATH = '/sounds/notification.mp3';

const VIBRATION_PATTERNS: Record<VibrationType, number | number[]> = {
    short: 100,
    long: 500,
    pulse: [200, 100, 200, 100, 200],
    success: [50, 50, 50],
};

export const useNotification = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const audio = new Audio(SOUND_PATH);
            audio.load(); // Eager load
            audioRef.current = audio;
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playNotification = useCallback(({
        withSound = false,
        withVibration = true,
        vibrationType = 'short'
    }: NotifyOptions = {}) => {
        if (withVibration && 'vibrate' in navigator) {
            const pattern = VIBRATION_PATTERNS[vibrationType] || 100;
            window.navigator.vibrate(pattern);
        }

        if (withSound && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((err) => {
                console.warn('Audio playback failed:', err);
            });
        }
    }, []);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, []);

    return { playNotification, stop };
};
