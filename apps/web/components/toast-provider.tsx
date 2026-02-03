"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

// Re-export toast for use throughout the app
export { toast };

// Toast types for consistent styling
export const showToast = {
    success: (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }) => {
        toast.success(message, {
            description: options?.description,
            action: options?.action,
        });
    },
    error: (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }) => {
        toast.error(message, {
            description: options?.description,
            action: options?.action,
        });
    },
    warning: (message: string, options?: { description?: string }) => {
        toast.warning(message, {
            description: options?.description,
        });
    },
    info: (message: string, options?: { description?: string }) => {
        toast.info(message, {
            description: options?.description,
        });
    },
    loading: (message: string) => {
        return toast.loading(message);
    },
    promise: <T,>(
        promise: Promise<T>,
        messages: { loading: string; success: string; error: string }
    ) => {
        return toast.promise(promise, messages);
    },
    dismiss: (toastId?: string | number) => {
        toast.dismiss(toastId);
    },
};

// Custom action toast
export function actionToast(
    message: string,
    options: {
        description?: string;
        action: { label: string; onClick: () => void };
        cancel?: { label: string; onClick?: () => void };
    }
) {
    toast(message, {
        description: options.description,
        action: {
            label: options.action.label,
            onClick: options.action.onClick,
        },
        cancel: options.cancel ? {
            label: options.cancel.label,
            onClick: options.cancel.onClick || (() => { }),
        } : undefined,
    });
}

// Toast Provider Component
export function ToastProvider() {
    return (
        <SonnerToaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: "hsl(220 16% 13%)",
                    border: "1px solid hsl(220 15% 18%)",
                    color: "hsl(220 15% 90%)",
                },
                classNames: {
                    toast: "rounded-lg shadow-xl",
                    title: "text-sm font-medium",
                    description: "text-xs text-muted-foreground",
                    actionButton: "bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-md",
                    cancelButton: "bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-md",
                    success: "border-l-4 border-l-[hsl(160_80%_45%)]",
                    error: "border-l-4 border-l-[hsl(0_85%_55%)]",
                    warning: "border-l-4 border-l-[hsl(25_95%_55%)]",
                    info: "border-l-4 border-l-[hsl(200_80%_55%)]",
                },
            }}
            closeButton
            richColors
            expand
            duration={4000}
        />
    );
}
