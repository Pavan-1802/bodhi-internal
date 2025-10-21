export default function ConfirmationModal({ message, onConfirm, onCancel }: { message: string, onConfirm: () => void, onCancel: () => void }) {
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Confirmation</h2>
                </div>
                <div className="px-6 py-4">
                    <p className="text-gray-600">{message}</p>
                </div>
                <div className="px-6 py-4 flex gap-2 border-t border-gray-200">
                    <button onClick={onConfirm} className="bg-blue-600 text-white px-4 py-2 rounded-md">Confirm</button>
                    <button onClick={onCancel} className="bg-red-600 text-white px-4 py-2 rounded-md">Cancel</button>
                </div>
            </div>
        </div>
    )
}