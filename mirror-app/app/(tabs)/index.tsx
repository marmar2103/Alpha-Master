import React, { useRef } from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { Colors } from '../../constants/colors';
import { MirrorScoreHero } from '../../components/dashboard/MirrorScoreHero';
import { ScoresGrid } from '../../components/dashboard/ScoresGrid';
import { AIInsightBanner } from '../../components/dashboard/AIInsightBanner';
import { WeeklyCalendar } from '../../components/dashboard/WeeklyCalendar';
import { CorrelationMap } from '../../components/dashboard/CorrelationMap';
import { CheckInSheet } from '../../components/log/CheckInSheet';
import { SkeletonCard, Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useMirrorScore } from '../../hooks/useMirrorScore';
import { useRecentScores } from '../../hooks/useHealthData';
import { useAIInsights, useGenerateInsight } from '../../hooks/useAIInsights';
import { useCorrelations } from '../../hooks/useCorrelations';
import { useAuthStore } from '../../stores/authStore';
import { useProfile } from '../../hooks/useHealthData';

export default function DashboardScreen() {
  const sheetRef = useRef<BottomSheet>(null);
  const { score, scores, isLoading: scoreLoading } = useMirrorScore();
  const { data: recentScores = [], refetch, isRefetching, isError, isLoading: historyLoading } = useRecentScores(7);
  const { data: insights = [], isLoading: insightsLoading } = useAIInsights();
  const { data: correlations = [] } = useCorrelations();
  const { mutate: generateInsight, isPending: isGenerating } = useGenerateInsight();
  const profile = useAuthStore(s => s.profile);
  useProfile();

  const isFirstLoad = scoreLoading && !scores;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.mint} />}
      >
        {isFirstLoad ? (
          <View style={{ alignItems: 'center', paddingVertical: 32, gap: 16 }}>
            <Skeleton width={140} height={140} borderRadius={70} />
            <Skeleton width="50%" height={24} />
          </View>
        ) : (
          <MirrorScoreHero
            score={score}
            userName={profile?.display_name ?? undefined}
            badges={score && score > 70 ? [{ label: '↑ Great day', color: Colors.mint }] : score && score < 40 ? [{ label: '↓ Rest up', color: Colors.rose }] : []}
          />
        )}

        {isError ? (
          <ErrorState message="Could not load scores" onRetry={refetch} />
        ) : isFirstLoad ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} style={{ width: '47%' }} />)}
          </View>
        ) : (
          <ScoresGrid scores={scores} />
        )}

        {insightsLoading ? (
          <View style={{ backgroundColor: Colors.card2, borderRadius: 16, padding: 16, gap: 10, borderWidth: 1, borderColor: Colors.border }}>
            <Skeleton height={10} width="40%" />
            <Skeleton height={16} />
            <Skeleton height={16} width="80%" />
          </View>
        ) : (
          <AIInsightBanner
            insights={insights}
            onGenerateNew={() => generateInsight('daily')}
            isGenerating={isGenerating}
          />
        )}

        <WeeklyCalendar scores={recentScores} />
        <CorrelationMap correlations={correlations.map(c => ({ ...c, correlation_coefficient: c.correlation_coefficient ?? null }))} />
        <View style={{ height: 20 }} />
      </ScrollView>

      <CheckInSheet sheetRef={sheetRef} />
    </SafeAreaView>
  );
}
