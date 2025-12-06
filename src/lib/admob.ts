/**
 * AdMob 광고 관리
 */
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from "@capacitor-community/admob";

// 테스트 광고 ID (실제 배포 시 AdMob에서 발급받은 ID로 교체)
const TEST_BANNER_ID = {
  ios: "ca-app-pub-3940256099942544/2934735716",
  android: "ca-app-pub-3940256099942544/6300978111",
};

// 실제 광고 ID (AdMob에서 발급받은 후 교체)
// const PROD_BANNER_ID = {
//   ios: "ca-app-pub-XXXXX/XXXXX",
//   android: "ca-app-pub-XXXXX/XXXXX",
// };

let isInitialized = false;

/**
 * AdMob 초기화
 */
export async function initializeAdMob(): Promise<void> {
  if (isInitialized) return;

  try {
    await AdMob.initialize({
      // 테스트 기기 설정 (개발 중에만)
      testingDevices: [],
      // 어린이 대상 앱 여부
      initializeForTesting: true,
    });
    isInitialized = true;
    console.log("AdMob initialized");
  } catch (error) {
    console.error("AdMob initialization failed:", error);
  }
}

/**
 * 배너 광고 표시
 */
export async function showBannerAd(): Promise<void> {
  try {
    // 플랫폼 감지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const adId = isIOS ? TEST_BANNER_ID.ios : TEST_BANNER_ID.android;

    // 배너 광고 이벤트 리스너
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      console.log("Banner ad loaded");
    });

    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
      console.error("Banner ad failed to load:", error);
    });

    // 배너 광고 표시
    await AdMob.showBanner({
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    });
  } catch (error) {
    console.error("Show banner ad failed:", error);
  }
}

/**
 * 배너 광고 숨기기
 */
export async function hideBannerAd(): Promise<void> {
  try {
    await AdMob.hideBanner();
  } catch (error) {
    console.error("Hide banner ad failed:", error);
  }
}

/**
 * 배너 광고 제거
 */
export async function removeBannerAd(): Promise<void> {
  try {
    await AdMob.removeBanner();
  } catch (error) {
    console.error("Remove banner ad failed:", error);
  }
}
