import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../../constants/colors';
import { MirrorScoreHero } from '../../components/dashboard/MirrorScoreHero';
import { ScoresGrid } from '../../components/dashboard/ScoresGrid';
import { AIInsightBanner } from '../../components/dashboard/AIInsightBanner';
import { WeeklyCalendar } from '../../components/dashboard/WeeklyCalendar';
import { CorrelationMap } from '../../components/dashboard/CorrelationMap';
import { CheckInSheet } from '../../components/log/CheckInSheet';
import { useMirrorScore } from '../../hooks/useMirrorScore';
import { useRecentScores } from '../../hooks/useHealthData';
import { useAIInsights, useGenerateInsight } from '../../hooks/useAIInsights';
import { useCorrelations } from '../../hooks/useCorrelations';
import { useAuthStore } from '../../stores/authStore';

export default function DashboardScreen() {
  const sheetRef = useRef<BottomSheet | null>(null);
  const { score, scores } = useMirrorScore();
  const { data: recentScores = [], refetch, isRefetching } = useRecentScores(7);
  const { data: insights = [] } = useAIInsights();
  const { data: correlations = [] } = useCorrelations();
  const { mutate: generateInsight, isPending: isGenerating } = useGenerateInsight();
  const profile = useAuthStore(s => s.profile);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.mint} />}
      >
        <MirrorScoreHero
          score={score}
          userName={profile?.display_name ?? undefined}
          badges={score && score > 70 ? [{ label: '↑ Great day', color: Colors.mint }] : []}
        />

        <ScoresGrid scores={scores} />

        <AIInsightBanner
          insights={insights}
          onGenerateNew={() => generateInsight('daily')}
          isGenerating={isGenerating}
        />

        <WeeklyCalendar scores={recentScores as any} />

        <CorrelationMap correlations={correlations as any} />

        <View style={{ height: 20 }} />
      </ScrollView>

      <CheckInSheet sheetRef={sheetRef} />
    </SafeAreaView>
  );
}
