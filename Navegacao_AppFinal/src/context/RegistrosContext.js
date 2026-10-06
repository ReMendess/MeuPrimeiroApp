import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import storage from '../utils/storage';

const RegistrosContext = createContext();

// Chaves usadas no storage
const CHAVE_MEDICOES = '@medicoes';
const CHAVE_FOTOS = '@fotos';
const CHAVE_AUDIOS = '@audios';

const lerLista = async (chave) => {
   try {
      const valorJSON = await storage.getItem(chave);
      const valor = valorJSON ? JSON.parse(valorJSON) : [];
      return Array.isArray(valor) ? valor : [];
   } catch (error) {
      console.error(`[Registros] Erro ao ler ${chave}:`, error);
      return [];
   }
};

export function RegistrosProvider({ children }) {
   const [medicoes, setMedicoes] = useState([]);
   const [fotos, setFotos] = useState([]);
   const [audios, setAudios] = useState([]);
   const [carregado, setCarregado] = useState(false);

   // Carrega os dados persistidos ao montar o provider
   useEffect(() => {
      let ativo = true;

      (async () => {
         const [medicoesSalvas, fotosSalvas, audiosSalvas] = await Promise.all([
            lerLista(CHAVE_MEDICOES),
            lerLista(CHAVE_FOTOS),
            lerLista(CHAVE_AUDIOS),
         ]);

         if (!ativo) return;

         setMedicoes(medicoesSalvas);
         setFotos(fotosSalvas);
         setAudios(audiosSalvas);
         setCarregado(true);
      })();

      return () => {
         ativo = false;
      };
   }, []);

   // Persiste as medições sempre que mudarem (após a carga inicial)
   useEffect(() => {
      if (!carregado) return;
      storage.setItem(CHAVE_MEDICOES, JSON.stringify(medicoes)).catch((error) =>
         console.error('[Registros] Erro ao salvar medições:', error)
      );
   }, [medicoes, carregado]);

   // Persiste as fotos
   useEffect(() => {
      if (!carregado) return;
      storage.setItem(CHAVE_FOTOS, JSON.stringify(fotos)).catch((error) =>
         console.error('[Registros] Erro ao salvar fotos:', error)
      );
   }, [fotos, carregado]);

   // Persiste os áudios
   useEffect(() => {
      if (!carregado) return;
      storage.setItem(CHAVE_AUDIOS, JSON.stringify(audios)).catch((error) =>
         console.error('[Registros] Erro ao salvar áudios:', error)
      );
   }, [audios, carregado]);

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
      () => ({
         medicoes,
         fotos,
         audios,
         carregado,
         adicionarMedicao,
         adicionarFoto,
         adicionarAudio,
      }),
      [medicoes, fotos, audios, carregado, adicionarMedicao, adicionarFoto, adicionarAudio]
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