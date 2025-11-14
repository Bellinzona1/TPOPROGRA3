import { useState, useEffect } from 'react';
import { X, Sparkles, Zap, MapPin, TrendingUp } from 'lucide-react';

export default function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar el banner cada vez que se carga la página
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
   <div></div>
  );
}
