import vex from 'vex-js';

export const confirm = (text: string, title: string | undefined) =>
    new Promise((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (vex as any).dialog.confirm({
            unsafeMessage:
                (title ? `<div class="dlg-title">${title}</div><br/>` : '') + `<div class="dlg-title-2">${text}</div>`,
            contentClassName: 'dlg-warning',
            callback: (confirmed: boolean) => resolve(confirmed),
        });
    });

export const success = (text: string, title: string | undefined) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vex as any).dialog.alert({
        unsafeMessage:
            (title ? `<div class="dlg-title">${title}</div><br/>` : '') + `<div class="dlg-title-2">${text}</div>`,
        contentClassName: 'dlg-success',
    });

export const alertInfo = (text = '') =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vex as any).dialog.alert({
        unsafeMessage: text,
        contentClassName: 'dlg-not-implemented',
    });
