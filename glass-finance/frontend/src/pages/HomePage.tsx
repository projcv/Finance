import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/UI/Modal';

export default function HomePage() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        }
    }, [isAuthenticated, isLoading, navigate]);

    return <Loading fullScreen text="Loading..." />;
}
