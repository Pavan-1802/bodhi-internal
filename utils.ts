export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export const getColor = (status: string): string => {
    switch (status) {
        case 'pending':
            return 'bg-gray-100 text-gray-700';
            
        case 'cost sheets prepared':
            return 'bg-blue-100 text-blue-800';

        case 'quotation prepared':
            return 'bg-indigo-100 text-indigo-800';

        case 'order delivered':
            return 'bg-green-100 text-green-800';

        default:
            return 'bg-red-100 text-red-800';
    }
}