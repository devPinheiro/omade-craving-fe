
interface ProductDeleteProps {
    productId: string
    onClose: () => void
    onDelete: (id: string) => void
}

const ProductDeleteModal = ( { productId, onClose, onDelete }: ProductDeleteProps) => {
  return (
    <div>
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-md w-[90%] md:rounded-lg shadow-lg p-6 md:w-full max-w-md ">
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-6">Are you sure you want to delete this product?</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onDelete(productId)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductDeleteModal