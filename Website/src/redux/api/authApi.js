import { useMutation } from 'react-query'; // Assuming you're using React Query for data fetching

const useUserLoginMutation = () => {
    // Define your login mutation function here
    const loginUser = async (formData) => {
        try {
            const response = await fetch('https://server-yvzt.onrender.com/api/userauth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to login');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    // Use React Query's useMutation hook to handle the mutation
    const { mutate, isError, isLoading, isSuccess, error } = useMutation(loginUser);

    return [mutate, { isError, isLoading, isSuccess, error }];
};

export default useUserLoginMutation;
