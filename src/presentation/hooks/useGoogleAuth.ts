import { useGoogleLogin } from '@react-oauth/google';

interface GoogleUser {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}
export const useGoogleAuth = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse: GoogleUser) => {
      console.log('Google login success:', tokenResponse);
      // Este será manejado en el componente
    },
    onError: (error) => {
      console.error('Google login error:', error);
    },
  });

  return {
    googleLogin,
  };
};
