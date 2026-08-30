import { useState } from 'react';

export function useSubmitForm(webhookUrl) {
  const [status, setStatus] = useState('idle');

  const submitData = async (data) => {
    setStatus('loading');
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Falha no envio');
      
      setStatus('success');
      // Redirecionamento para o WhatsApp exigido nas regras
      window.location.href = `https://wa.me/SEU_NUMERO_AQUI?text=Olá,%20acabei%20de%20preencher%20o%20formulário!`;
      
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return { submitData, status };
}