import { CSSObject, MantineTheme, NotificationProps, NotificationStylesNames } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { AlertTriangle, CircleCheck, CircleX, InfoCircle } from 'tabler-icons-react';
import { catchError, from } from 'rxjs';

const styles:
    | Partial<Record<NotificationStylesNames, CSSObject>>
    | ((theme: MantineTheme) => Partial<Record<NotificationStylesNames, CSSObject>>) = theme => ({
    description: {
        color: theme.colors.gray[6]
    }
});

interface Notification {
    title: string;
    message?: string;
}

export const info = ({ title, message }: Notification, options?: NotificationProps) => {
    const id = randomId();

    showNotification({
        id,
        title,
        message,
        icon: <InfoCircle />,
        styles: theme => styles(theme),
        color: 'primary',
        ...options
    });

    return id;
};

export const success = ({ title, message }: Notification, options?: NotificationProps) => {
    const id = randomId();

    showNotification({
        id,
        title,
        message,
        color: 'third',
        icon: <CircleCheck />,
        styles: theme => styles(theme),
        ...options
    });

    return id;
};

export const warn = ({ title, message }: Notification, options?: NotificationProps) => {
    const id = randomId();

    showNotification({
        id,
        title,
        message,
        color: 'yellow',
        icon: <AlertTriangle />,
        styles: theme => styles(theme),
        ...options
    });

    return id;
};

export const error = ({ title, message }: Notification, options?: NotificationProps) => {
    const id = randomId();

    showNotification({
        id,
        title,
        message,
        icon: <CircleX />,
        color: 'secondary',
        styles: theme => styles(theme),
        ...options
    });

    return id;
};

export interface PromiseNotification {
    loading: Notification;
    success?: Notification;
    error?: Notification;
}

export interface PromiseNotificationProps extends NotificationProps {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    onSuccessContent?: (data: any) => Notification;
    onErrorContent?: (error: any) => Notification;
    noAutoUpdate?: boolean;
}

export const promise = (
    action: Promise<any>,
    content: PromiseNotification,
    options?: PromiseNotificationProps
) => {
    const id = randomId();

    const {
        onSuccess,
        onError,
        onSuccessContent,
        onErrorContent,
        noAutoUpdate,
        ...notificationOptions
    } = options || {};

    showNotification({
        id,
        title: content.loading.title,
        message: content.loading.message,
        autoClose: false,
        disallowClose: true,
        loading: true,
        color: 'primary',
        styles: theme => styles(theme),
        ...notificationOptions
    });

    const promise$ = from(action).pipe(
        catchError(err => {
            throw err;
        })
    );

    promise$.subscribe({
        next: data => {
            if (onSuccess) onSuccess(data);

            if (noAutoUpdate) return;

            const message = onSuccessContent ? onSuccessContent(data) : content.success;

            updateNotification({
                id,
                title: message?.title || 'Success',
                message: message?.message || 'Your request was successful',
                color: 'third',
                styles: theme => styles(theme),
                icon: <CircleCheck />
            });
        },
        error: err => {
            if (onError) onError(err);

            if (noAutoUpdate) return;

            const message = onErrorContent ? onErrorContent(err) : content.error;

            updateNotification({
                id,
                title: message?.title || 'Error',
                message: message?.message || 'Error processing your request',
                styles: theme => styles(theme),
                color: 'secondary',
                icon: <CircleX />
            });
        }
    });

    return id;
};