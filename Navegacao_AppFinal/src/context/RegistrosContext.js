import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const RegistrosContext = createContext();

// Dados iniciais simulados (como se já tivessem vindo de uma API)
const medicoesIniciais = [
   { id: 1, sistolica: 120, diastolica: 80, data: '02/08/2026', hora: '08:30' },
   { id: 2, sistolica: 135, diastolica: 88, data: '01/08/2026', hora: '14:15' },
   { id: 3, sistolica: 118, diastolica: 75, data: '31/07/2026', hora: '09:00' },
];

export function RegistrosProvider({ children }) {
   const [medicoes, setMedicoes] = useState(medicoesIniciais);
   const [fotos, setFotos] = useState([]);
   const [audios, setAudios] = useState([]);

   const adicionarMedicao = useCallback((medicao) => {
      setMedicoes((anteriores) => [medicao, ...anteriores]);
   }, []);

   const adicionarFoto = useCallback((foto) => {
      setFotos((anteriores) => [foto, ...anteriores]);
   }, []);

   const adicionarAudio = useCallback((audio) => {
      setAudios((anteriores) => [audio, ...anteriores]);
   }, []);

   const value = useMemo(
      () => ({ medicoes, fotos, audios, adicionarMedicao, adicionarFoto, adicionarAudio }),
      [medicoes, fotos, audios, adicionarMedicao, adicionarFoto, adicionarAudio]
   );

   return <RegistrosContext.Provider value={value}>{children}</RegistrosContext.Provider>;
}

export function useRegistros() {
   const contexto = useContext(RegistrosContext);
   if (!contexto) {
      throw new Error('useRegistros deve ser usado dentro de <RegistrosProvider>');
   }
   return contexto;
}