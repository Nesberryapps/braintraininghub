
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

const AppStoreIcons = () => (
    <div className="flex flex-col gap-4">
        <p>To get hints and other bonuses, please download our free mobile app from the App Store or Google Play Store!</p>
        <div className="flex gap-4 items-center">
            {/* Apple App Store Icon */}
            <a href="https://apps.apple.com/us/app/brain-training-hub-games/id6755921763" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-primary transition-colors"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
            </a>
            {/* Google Play Store Icon */}
             <a href="https://play.google.com/store/apps/details?id=com.nesberry.braintraining" target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-primary transition-colors"><path d="M21.31,12.31,6.44,2.2a.5.5,0,0,0-.79.42V21.38a.5.5,0,0,0,.79.42l14.87-10.11a.5.5,0,0,0,0-.84Z"></path><line x1="6.44" y1="2.62" x2="15.75" y2="12"></line><line x1="6.44" y1="21.38" x2="15.75" y2="12"></line></svg>
            </a>
        </div>
    </div>
);


export async function showRewardAd(onRewardEarned: () => void) {
  if (!Capacitor.isNativePlatform()) {
    // On web, show a toast notification instead of granting the reward.
    toast({
      title: 'Feature Available in the App!',
      description: <AppStoreIcons />,
    });
    return;
  }

  // Google Test Unit IDs (Swap these for Real IDs before launch!)
  const adId = Capacitor.getPlatform() === 'ios'
    ? 'ca-app-pub-6191158195654090/2927179100'
    : 'ca-app-pub-6191158195654090/8956017949';

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
