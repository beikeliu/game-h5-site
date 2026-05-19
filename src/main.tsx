import { unstableSetRender } from 'antd-mobile'; // Support since version ^5.40.0
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useMatch, useLocation, Navigate } from "react-router";
import './index.css'
import HeroSelector from './pages/hero-selector/index.tsx';
import HeroScore from './pages/hero-score/index.tsx';

function KeepAlivePage({ path, element }: { path: string; element: React.ReactNode }) {
  const match = useMatch(path)
  return (
    <div style={{ display: match ? 'block' : 'none', height: '100vh' }}>
      {element}
    </div>
  )
}

function RouteTitle() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/hero-selector' || location.pathname === '/hero-score') {
      document.title = '王者最低战力查询'
    } else {
      document.title = '可可助手'
    }
  }, [location.pathname])

  return null
}

function RootApp() {
  return (
    <BrowserRouter>
      <RouteTitle />
      <Routes>
        <Route path="/" element={<Navigate to="/hero-selector" replace />} />
        <Route path="/hero-score" element={<HeroScore />} />
        <Route path="*" element={<Navigate to="/hero-selector" replace />} />
      </Routes>
      <KeepAlivePage
        path="/hero-selector"
        element={<HeroSelector />}
      />
    </BrowserRouter>
  )
}

unstableSetRender((node, container) => {
  // @ts-ignore 
  container._reactRoot ||= createRoot(container);
  // @ts-ignore
  const root = container._reactRoot;
  root.render(node);
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
