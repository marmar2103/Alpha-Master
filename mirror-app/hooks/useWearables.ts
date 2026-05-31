import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useQueryClient } from '@tanstack/react-query';

export type WearableSource = 'apple_health' | 'google_fit' | 'fitbit' | 'garmin';

interface WearableConnection {
  source: WearableSource;
  connected: boolean;
  lastSync?: string;
}

export function useWearables() {
  const user = useAuthStore(s => s.user);
  const queryClient = useQueryClient();
  const [connections, setConnections] = useState<WearableConnection[]>([
    { source: 'apple_health', connected: false },
    { source: 'google_fit', connected: false },
  ]);
  const [isSyncing, setIsSyncing] = useState(false);

  const connect = useCallback(async (source: WearableSource) => {
    if (Platform.OS !== 'ios' && source === 'apple_health') {
      Alert.alert('Not available', 'Apple Health requires an iOS device.');
      return;
    }
    // In production: request HealthKit/Health Connect permissions here
    setConnections(prev => prev.map(c => c.source === source ? { ...c, connected: true } : c));
    Alert.alert('Connected', `${source.replace('_', ' ')} connected! Syncing data...`);
  }, []);

  const disconnect = useCallback((source: WearableSource) => {
    setConnections(prev => prev.map(c => c.source === source ? { ...c, connected: false } : c));
  }, []);

  const syncData = useCallback(async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      // Stub: In production, fetch from HealthKit/Health Connect and upsert to wearable_data
      await new Promise<void>(r => setTimeout(r, 1500));
      queryClient.invalidateQueries({ queryKey: ['wearable'] });
      queryClient.invalidateQueries({ queryKey: ['scores'] });
    } finally {
      setIsSyncing(false);
    }
  }, [user, queryClient]);

  return { connections, connect, disconnect, syncData, isSyncing };
}
