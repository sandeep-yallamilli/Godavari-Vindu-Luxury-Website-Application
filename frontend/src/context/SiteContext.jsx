/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteAssets, fetchGalleryImages } from '../services/api';

const SiteContext = createContext();

export const useSite = () => useContext(SiteContext);

export const SiteProvider = ({ children }) => {
  const [siteAssets, setSiteAssets] = useState({});
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSiteData = async () => {
      try {
        const [assetsRes, galleryRes] = await Promise.all([
          fetchSiteAssets(),
          fetchGalleryImages()
        ]);
        setSiteAssets(assetsRes.data);
        // DRF may return paginated { results: [...] } or a plain array
        const gallery = galleryRes.data.results || galleryRes.data;
        setGalleryImages(Array.isArray(gallery) ? gallery : []);
      } catch (err) {
        console.error('Failed to load site assets or gallery images:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSiteData();
  }, []);

  const getAssetUrl = (key, fallbackLocalPath) => {
    if (siteAssets && siteAssets[key]) {
      return siteAssets[key];
    }
    return fallbackLocalPath;
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/images/') || url.startsWith('images/')) {
      return url.startsWith('/') ? url : '/' + url;
    }
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiUrl ? apiUrl.replace(/\/api\/?$/, '') : '';
    
    let path = url;
    if (!path.startsWith('/')) {
      if (path.startsWith('media/')) {
        path = '/' + path;
      } else {
        path = '/media/' + path;
      }
    }
    return `${baseUrl}${path}`;
  };

  return (
    <SiteContext.Provider value={{ siteAssets, galleryImages, getAssetUrl, getImageUrl, loading }}>
      {children}
    </SiteContext.Provider>
  );
};
