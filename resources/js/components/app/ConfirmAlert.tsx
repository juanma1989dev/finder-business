import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmAlertOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => Promise<void> | void;
}

interface InternalConfirmAlertProps extends ConfirmAlertOptions {
    onResolve: (value: boolean) => void;
}

function InternalConfirmAlert({
    title = '¿Estás seguro?',
    description = 'Esta acción no se puede deshacer.',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onResolve,
}: InternalConfirmAlertProps) {
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        onResolve(false);
        setOpen(false);
    };

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm?.();
            onResolve(true);
        } catch {
            onResolve(false);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return createPortal(
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={loading}
                        onClick={handleCancel}
                        className="flex items-center gap-2 border-none bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                    >
                        {cancelText}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading}
                        onClick={handleConfirm}
                        className="flex items-center gap-2 border-none bg-red-50 text-red-600 shadow-none hover:bg-red-100 hover:text-red-700"
                    >
                        {loading && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>,
        document.body,
    );
}

export function confirmAlert(options?: ConfirmAlertOptions): Promise<boolean> {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const cleanup = () => {
            setTimeout(() => {
                container.remove();
            }, 200);
        };

        const DialogWrapper = () => {
            useEffect(() => cleanup, []);
            return (
                <InternalConfirmAlert
                    {...options}
                    onResolve={(result) => {
                        resolve(result);
                        cleanup();
                    }}
                />
            );
        };

        import('react-dom/client').then((ReactDOM) => {
            const root = ReactDOM.createRoot(container);
            root.render(<DialogWrapper />);
        });
    });
}
