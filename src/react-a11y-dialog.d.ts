import * as React from 'react';
import A11yDialogLib from 'a11y-dialog';
export type ReactA11yDialogProps = {
    role?: 'dialog' | 'alertdialog';
    id: string;
    title: React.ReactNode;
    dialogRef?: (instance?: A11yDialogLib) => unknown;
    dialogRoot?: string;
    titleId?: string;
    closeButtonLabel?: string;
    closeButtonContent?: React.ReactNode;
    closeButtonPosition?: 'first' | 'last' | 'none';
    classNames?: {
        container?: string;
        overlay?: string;
        dialog?: string;
        title?: string;
        closeButton?: string;
    };
};
type Attributes = {
    container: React.HTMLAttributes<HTMLDivElement> & {
        ref: React.LegacyRef<HTMLDivElement>;
    };
    overlay: React.HTMLAttributes<HTMLDivElement>;
    dialog: React.HTMLAttributes<HTMLDivElement>;
    closeButton: React.ButtonHTMLAttributes<HTMLButtonElement>;
    title: React.HTMLAttributes<HTMLElement>;
};
export declare const useA11yDialog: (props: ReactA11yDialogProps) => [A11yDialogLib | null, Attributes];
export declare const A11yDialog: React.FC<React.PropsWithChildren<ReactA11yDialogProps>>;
export {};
