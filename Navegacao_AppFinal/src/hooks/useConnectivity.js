import { useNetworkState } from 'expo-network';

/**
 * Hook que expõe o estado de conectividade do dispositivo.
 * Usa useNetworkState do expo-network, que atualiza automaticamente
 * quando a conexão muda.
 */
export default function useConnectivity() {
   const networkState = useNetworkState();

   return {
      // Conectado se há rede ativa. Em plataformas onde `isInternetReachable`
      // não é informado (ex.: web ou iOS), basta que `isConnected` seja true.
      isConnected: networkState.isConnected === true && networkState.isInternetReachable !== false,
      type: networkState.type,
      networkState,
   };
}