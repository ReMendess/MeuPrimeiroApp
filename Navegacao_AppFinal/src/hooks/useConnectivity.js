import { useNetworkState } from 'expo-network';

/**
 * Hook que expõe o estado de conectividade do dispositivo.
 * Usa useNetworkState do expo-network, que atualiza automaticamente
 * quando a conexão muda.
 */
export default function useConnectivity() {
   const networkState = useNetworkState();

   return {
      // Conectado se não houver indicação explícita de falta de rede.
      // Enquanto o estado ainda não foi medido (isConnected === undefined),
      // assumimos conectado para não bloquear o usuário no primeiro instante.
      isConnected:
         networkState.isConnected !== false && networkState.isInternetReachable !== false,
      type: networkState.type,
      networkState,
   };
}