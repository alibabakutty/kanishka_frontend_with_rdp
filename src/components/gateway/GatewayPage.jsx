import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const GatewayPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  
  // 1. Flatten the menu items for easier indexing
  const menuItems = useMemo(() => [
    { section: 'MASTERS',  label: 'Accounting Master - Sundry Creditors',        hotkey: 'A', path: '/fetch_customers' },
    { section: 'MASTERS',  label: 'Inventory Master - Material',                 hotkey: 'I', path: '/fetch_inventories'   },
    { section: 'VOUCHERS', label: 'Purchase Order - Material',                   hotkey:'P',  path  : '/fetch_material_po'          }, 
    { section: 'VOUCHERS', label: 'Purchase Order - Labour',                     hotkey:'P',  path  :'/fetch_labour_po'             },
    { section: 'VOUCHERS', label: 'Purchase Order - General',                    hotkey:'P',  path  : '/fetch_purchase_order'       },
    { section: 'Daybook',  label: 'Purchase Order - Daybook',                    hotkey:'P',  path  :'/daybook'                     },
    { section: 'Daybook',  label: 'Purchase Order - MLG',                        hotkey:'P',  path  :'/daybook_item'                },
    { section: 'VOUCHERS', label: 'Purchase Order - Material',                   hotkey:'P',  path  : '/fetch_material_item'        },
    { section: 'VOUCHERS', label: 'Purchase Order - Labour',                     hotkey:'P',  path  : '/fetch_labour_item'          },
    { section: 'VOUCHERS', label: 'Purchase Order - General',                    hotkey:'P',  path  : '/fetch_item_purchase_order'  },
    { section:  '',        label: 'Quit',                                        hotkey:'Q',  isQuit: true                          },
  ], []);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token && token.includes(".")) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch (error) { console.error('Logout failed', error); }
    }
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  // 2. Keyboard Logic
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % menuItems.length);
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'Enter') {
        const currentItem = menuItems[selectedIndex];
        if (currentItem.isQuit) handleLogout();
        else if (currentItem.path) navigate(currentItem.path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, navigate, handleLogout, menuItems]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fdf8e1] relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[200%] h-35 bg-[#f6eec7] -rotate-7 -translate-y-1/2 origin-left"></div>
      </div>

      <header className="z-10 bg-[#1e4e8a] text-white px-1 py-1 flex items-center justify-between shadow-md">
        <h1 className="text-sm font-bold tracking-wide uppercase">Kanishka Purchase Order</h1>
        <div className="flex items-right gap-4 text-sm">
          <span><strong>{username} </strong>||</span>
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        </div>
      </header>

      <main className="flex-[0.3]  z-5 flex items-center justify-center p-0">
        <div className="w-full max-w-xs bg-[#e1f0ff] border-2 border-[#1e4e8a] shadow-2xl rounded-sm overflow-hidden">
          <div className="bg-[#1e4e8a] text-white py-1 text-center font-bold text-sm uppercase tracking-wider">
            Gateway of Kanishka
          </div>

          <div className="py-2">
            {menuItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {/* Section Header (Show only if first item in section) */}
                {(idx === 0 || menuItems[idx - 1].section !== item.section) && (
                  <h3 className="text-gray-400 text-[10px] font-bold tracking-[0.2em] mt-2 mb-1 uppercase text-center">
                    {item.section}
                  </h3>
                )}
                
                <div
                  onClick={() => item.isQuit ? handleLogout() : navigate(item.path)}
                  className={`
                    text-[#003366] pl-7 text-[13px] font-semibold cursor-pointer py-1 transition-colors
                    ${selectedIndex === idx ? 'bg-yellow-100' : 'hover:bg-yellow-100'}
                  `}
                >
                  <span className="underline decoration-1 underline-offset-2">{item.hotkey}</span>
                  {item.label.substring(1)}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GatewayPage;
