import { Dispatch, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type TabValue = any;

interface UseTabsReturn {
  handleTabChange: (event: React.SyntheticEvent, val: TabValue) => void;
  setActiveTab: Dispatch<any>;
  activeTab: TabValue;
}

const useTabs = (initialTab: any, onTabChange?: () => void): UseTabsReturn => {
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);

  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
    navigate(location.pathname, { replace: true });
    onTabChange?.();
  };

  return { handleTabChange, activeTab, setActiveTab };
};

export default useTabs;
