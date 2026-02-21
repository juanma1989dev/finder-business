import { InertiaFormProps, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface UseDialogOptions<T extends Record<string, any>> {
    initialData: T;
}

export function useDialog<T extends Record<string, any>>({
    initialData,
}: UseDialogOptions<T>) {
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const form: InertiaFormProps<T> = useForm<T>(initialData);

    const openForCreate = () => {
        form.reset();
        form.clearErrors();
        setEditingId(null);
        setOpen(true);
    };

    const openForEdit = (id: string, data: T) => {
        form.setData(data);
        form.clearErrors();
        setEditingId(id);
        setOpen(true);
    };

    const close = () => {
        form.reset();
        form.clearErrors();
        setEditingId(null);
        setOpen(false);
    };

    return {
        open,
        editingId,
        form,
        openForCreate,
        openForEdit,
        close,
        setOpen,
    };
}
