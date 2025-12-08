import { AdMob, RewardAdOptions, AdLoadInfo, RewardAdPluginEvents, AdMobRewardItem } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export async function initializeAdMob() {
  if (Capacitor.isNativePlatform()) {
    await AdMob.initialize({
        initializeForTesting: true,
    });
  }
}

export async function showRewardAd(onRewardEarned: () => void) {
  if (!Capacitor.isNativePlatform()) {
    console.log("Web Mode: Skipping ad, granting reward.");
    onRewardEarned(); // On web, just give the hint immediately
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