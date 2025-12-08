
import { AdMob, RewardAdOptions, AdLoadInfo, RewardAdPluginEvents, AdMobRewardItem } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { toast } from '@/hooks/use-toast';

export async function initializeAdMob() {
  if (Capacitor.isNativePlatform()) {
    await AdMob.initialize({
        initializeForTesting: true,
    });
  }
}

export async function showRewardAd(onRewardEarned: () => void) {
  if (!Capacitor.isNativePlatform()) {
    // On web, show a toast notification instead of granting the reward.
    toast({
      title: 'Feature Available in the App!',
      description:
        'To get hints and other bonuses, please download our mobile app. The app is currently in review and will be available on the App Store and Google Play Store soon!',
    });
    return;
  }

  // Google Test Unit IDs (Swap these for Real IDs before launch!)
  const adId = Capacitor.getPlatform() === 'ios'
    ? 'ca-app-pub-3940256099942544/1712485313'
    : 'ca-app-pub-3940256099942544/5224354917';

  try {
    // 1. Listen for the "User Finished Watching" event
    const listener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
      console.log('User earned reward:', reward);
      onRewardEarned(); // <--- This runs your specific game logic (Give Hint / Add Time)
      listener.remove();
    });

    // 2. Load and Show
    await AdMob.prepareRewardVideoAd({ adId });
    await AdMob.showRewardVideoAd();

  } catch (error) {
    console.error('Ad failed:', error);
    // Optional: If ad fails, maybe give the reward anyway to be nice?
    onRewardEarned(); 
  }
}
