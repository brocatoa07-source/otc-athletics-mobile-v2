/**
 * Push Notification Manager
 *
 * Handles:
 *   - Permission requests
 *   - Token registration
 *   - Local notification scheduling
 *   - Behavior-driven notification triggers
 *
 * Uses expo-notifications for local push.
 * Remote push via Supabase can be added later.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'otc:push-token';
const PERMISSION_KEY = 'otc:push-permission';

// ── Configuration ───────────────────────────────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ── Permission & Token ──────────────────────────────────────────────────────

export async function requestPushPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') {
    await AsyncStorage.setItem(PERMISSION_KEY, 'granted');
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  await AsyncStorage.setItem(PERMISSION_KEY, status);
  return status === 'granted';
}

export async function getPushToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'OTC Athletics',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId: undefined, // Uses default from app.json
    });
    await AsyncStorage.setItem(TOKEN_KEY, token);
    return token;
  } catch {
    return null;
  }
}

export async function getStoredToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

// ── Local Notification Scheduling ───────────────────────────────────────────

export type NotificationTriggerType =
  | 'pr_window'
  | 'compliance_drop'
  | 'streak'
  | 'weekly_review'
  | 'monthly_report'
  | 'trial_ending'
  | 'trial_expired'
  | 'missed_workout';

interface ScheduleOptions {
  type: NotificationTriggerType;
  title: string;
  body: string;
  /** Delay in seconds from now */
  delaySeconds?: number;
  /** Specific date/time to fire */
  date?: Date;
}

/**
 * Schedule a local push notification.
 */
export async function scheduleNotification(options: ScheduleOptions): Promise<string | null> {
  const hasPermission = await AsyncStorage.getItem(PERMISSION_KEY);
  if (hasPermission !== 'granted') return null;

  try {
    const trigger: Notifications.NotificationTriggerInput = options.date
      ? { type: Notifications.SchedulableTriggerInputTypes.DATE, date: options.date }
      : { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: options.delaySeconds ?? 1, repeats: false };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: options.title,
        body: options.body,
        data: { type: options.type },
      },
      trigger,
    });
    return id;
  } catch {
    return null;
  }
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ── Behavior-Driven Triggers ────────────────────────────────────────────────

/**
 * Schedule notifications based on current behavior signals.
 * Called after progression decision is computed.
 */
export async function scheduleBehaviorNotifications(params: {
  prWindowOpen: boolean;
  complianceRate: number;
  streak: number;
  trialDaysRemaining: number;
  trialExpired: boolean;
  progressionDecision: string;
}): Promise<void> {
  const { prWindowOpen, complianceRate, streak, trialDaysRemaining, trialExpired } = params;

  // Cancel previous scheduled notifications to avoid duplicates
  await cancelAllNotifications();

  if (prWindowOpen) {
    await scheduleNotification({
      type: 'pr_window',
      title: 'PR Window Open',
      body: 'Your readiness, compliance, and outputs all look good. Test this week.',
      delaySeconds: 3600, // 1 hour from now
    });
  }

  if (complianceRate < 0.6 && complianceRate > 0) {
    await scheduleNotification({
      type: 'compliance_drop',
      title: 'Don\'t Miss Twice',
      body: 'Your compliance dropped this week. Show up tomorrow.',
      delaySeconds: 7200,
    });
  }

  if (streak >= 5) {
    await scheduleNotification({
      type: 'streak',
      title: `${streak}-Day Streak`,
      body: 'Keep building. Consistency is what separates.',
      delaySeconds: 5400,
    });
  }

  if (trialDaysRemaining === 2) {
    await scheduleNotification({
      type: 'trial_ending',
      title: 'Trial Ending Soon',
      body: 'Your free trial ends in 2 days. Choose a plan to keep your access.',
      delaySeconds: 1800,
    });
  }

  if (trialExpired) {
    await scheduleNotification({
      type: 'trial_expired',
      title: 'Trial Ended',
      body: 'Your free trial has ended. Choose a plan to continue your development.',
      delaySeconds: 60,
    });
  }
}
