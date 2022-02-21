export const appendStyle = (element: HTMLElement, styles: {[key: string]: string}) => {
    if (element && styles) {
        Object.assign(element.style, styles);
    }
};
