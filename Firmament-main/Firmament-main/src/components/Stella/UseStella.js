import React, { useEffect } from 'react';

function useChatbot(channelId, token) {
  const script = document.createElement('script');

  script.innerHTML = 'Radiate.init("' + channelId.toString() + '", "' + token.toString() + '")';
  script.async = true;

  document.body.appendChild(script);
};

export function useStella(url, cId, tId) {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;
    script.onload = () => { useChatbot(cId, tId); }

    document.body.appendChild(script);
 
    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};
