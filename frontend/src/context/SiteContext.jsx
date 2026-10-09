import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSettings, fetchCategories, fetchServices } from '../services/api';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: 'Nhôm Kính Huy Hoàng - Thọ Xuân, Thanh Hóa',
    brand_name: 'Nhôm Kính Huy Hoàng',
    hotline: '0978398567',
    zalo: '0978398567',
    email: 'huyhoangnhomkinh77@gmail.com',
    address: 'Thôn Tân Thành, xã Thọ Hải, huyện Thọ Xuân, tỉnh Thanh Hóa',
    opening_hours: '07:00 - 18:30 (Thứ 2 - Chủ Nhật)',
    meta_description: 'Cơ sở Nhôm Kính Huy Hoàng tại Thọ Xuân, Thanh Hóa chuyên thi công cửa nhôm Xingfa, cửa kính cường lực, vách kính, lan can, mái kính uy tín, chuyên nghiệp, giá tốt nhất.',
    google_map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d105.5!3d19.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136500000000000%3A0x0!2zVGjhu40gSOG6o2ksIFRo4buNIFh1w6JuLCBUaGFuaCBIw7Fh!5e0!3m2!1svi!2svn!4v1680000000000!5m2!1svi!2svn'
  });
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quote modal state (accessible globally)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState({ service_name: '', note: '' });

  const openQuoteModal = (prefill = {}) => {
    setQuotePrefill(prefill);
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setQuotePrefill({ service_name: '', note: '' });
  };

  const reloadData = async () => {
    try {
      const [settRes, catRes, servRes] = await Promise.all([
        fetchSettings().catch(() => ({ data: { data: {} } })),
        fetchCategories().catch(() => ({ data: { data: [] } })),
        fetchServices().catch(() => ({ data: { data: [] } }))
      ]);

      if (settRes.data && settRes.data.data) {
        setSettings(prev => ({ ...prev, ...settRes.data.data }));
      }
      if (catRes.data && catRes.data.data) {
        setCategories(catRes.data.data);
      }
      if (servRes.data && servRes.data.data) {
        setServices(servRes.data.data);
      }
    } catch (error) {
      console.error('Error loading global site data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <SiteContext.Provider value={{
      settings,
      categories,
      services,
      loading,
      reloadData,
      isQuoteModalOpen,
      quotePrefill,
      openQuoteModal,
      closeQuoteModal
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
