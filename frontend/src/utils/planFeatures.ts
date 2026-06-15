// Tarif imkoniyatlarini aniqlash

export type PlanFeatures = {
  movieLimit: number;
  quality: '720p' | '1080p' | '4K';
  hasAds: boolean;
  downloadLimit: number; // 0 = yo'q
  deviceLimit: number;
  familyMode: boolean;
  earlyAccess: boolean;
};

export const getPlanFeatures = (): PlanFeatures => {
  const isDemo   = localStorage.getItem('cv_is_demo') === '1';
  const planName = localStorage.getItem('cv_plan_name') || '';

  if (isDemo || planName.includes('1 Oylik')) {
    return {
      movieLimit:   10,
      quality:      '720p',
      hasAds:       true,
      downloadLimit: 0,
      deviceLimit:  1,
      familyMode:   false,
      earlyAccess:  false,
    };
  }
  if (planName.includes('3 Oylik')) {
    return {
      movieLimit:   50,
      quality:      '1080p',
      hasAds:       false,
      downloadLimit: 5,
      deviceLimit:  2,
      familyMode:   false,
      earlyAccess:  false,
    };
  }
  if (planName.includes('6 Oylik')) {
    return {
      movieLimit:   100,
      quality:      '4K',
      hasAds:       false,
      downloadLimit: 20,
      deviceLimit:  3,
      familyMode:   false,
      earlyAccess:  true,
    };
  }
  if (planName.includes('1 Yillik')) {
    return {
      movieLimit:   Infinity,
      quality:      '4K',
      hasAds:       false,
      downloadLimit: Infinity,
      deviceLimit:  5,
      familyMode:   true,
      earlyAccess:  true,
    };
  }
  // Default (plan tanlanmagan)
  return {
    movieLimit:   Infinity,
    quality:      '1080p',
    hasAds:       false,
    downloadLimit: 0,
    deviceLimit:  1,
    familyMode:   false,
    earlyAccess:  false,
  };
};

export const getDownloadedMovies = (): string[] => {
  try { return JSON.parse(localStorage.getItem('downloaded_movies') || '[]'); } catch { return []; }
};

export const addDownload = (movieId: string): boolean => {
  const features = getPlanFeatures();
  const downloaded = getDownloadedMovies();
  if (downloaded.includes(movieId)) return true; // allaqachon yuklangan
  if (features.downloadLimit === 0) return false; // ruxsat yo'q
  if (features.downloadLimit !== Infinity && downloaded.length >= features.downloadLimit) return false; // limit tugagan
  downloaded.push(movieId);
  localStorage.setItem('downloaded_movies', JSON.stringify(downloaded));
  return true;
};
