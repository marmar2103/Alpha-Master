import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleAllNotifications(userName: string, score: number, topInsight: string): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Good morning, ${userName}`,
      body: `Your mirror score is ${score}. ${topInsight}`,
    },
    trigger: { hour: 8, minute: 0, repeats: true },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'How are you feeling today?',
      body: 'Take 30 seconds to log your day. Your AI is waiting.',
    },
    trigger: { hour: 21, minute: 0, repeats: true },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your weekly mirror report is ready',
      body: 'See what your body learned this week.',
    },
    trigger: { weekday: 2, hour: 9, minute: 0, repeats: true },
  });
}

export async function sendStressAlert(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚠️ Stress spike detected',
      body: 'Your HRV dropped significantly. Consider a 5-min breathing break.',
    },
    trigger: null,
  });
}
