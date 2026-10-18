import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi, type ProductRequest } from '@/features/products/api/api';
import { Button } from '@/shared/components/ui/Button';
import type { ProductResponse } from '@/shared/types/api';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: ProductResponse | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function ProductFormModal({ isOpen, onClose, productToEdit }: ProductFormModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: String(productToEdit.price),
        stock: String(productToEdit.stock),
        category: productToEdit.category,
        imageUrl: productToEdit.imageUrl || '',
      });
      setPreviewUrl(
        productToEdit.imageUrl
          ? productToEdit.imageUrl.startsWith('http')
            ? productToEdit.imageUrl
            : `${API_URL}${productToEdit.imageUrl}`
          : ''
      );
    } else {
      setFormData({ name: '', price: '', stock: '', category: '', imageUrl: '' });
      setPreviewUrl('');
    }
  }, [productToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data: ProductRequest) => {
      if (productToEdit) return productApi.update(productToEdit.id, data);
      return productApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(productToEdit ? 'Produto atualizado!' : 'Produto criado!');
      onClose();
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Erro ao salvar o produto.');
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);

    try {
      const { url } = await productApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      toast.success('Imagem enviada!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar a imagem.');
      setPreviewUrl(
        productToEdit?.imageUrl
          ? productToEdit.imageUrl.startsWith('http')
            ? productToEdit.imageUrl
            : `${API_URL}${productToEdit.imageUrl}`
          : ''
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      imageUrl: formData.imageUrl || null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-900">
            {productToEdit ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Dropzone de Imagem */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Imagem do Produto</label>
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`relative flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
                isUploading ? 'border-blue-300 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-2" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <svg className="h-10 w-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-sm font-medium">Clique para enviar uma imagem</p>
                  <p className="text-xs text-slate-400">PNG, JPG ou WEBP (máx 5MB)</p>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estoque</label>
              <input
                required
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <input
              required
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 outline-none"
              placeholder="Ex: Eletrônicos"
            />
          </div>

          {/* Botões de Ação */}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending || isUploading} className="!bg-blue-600 hover:!bg-blue-700">
              {mutation.isPending ? 'Salvando...' : 'Salvar Produto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}