
export type ViewType = 'grid' | 'table';

export const defaultLayout: ViewType = 'grid';

const localStorageKey_prefix = 'view_type_';

const getKey = (path: string): string => {
    return `${localStorageKey_prefix}${path}`;
}

export const saveViewType = (path: string, layout: ViewType) => {
    try {
        localStorage.setItem(getKey(path), JSON.stringify(layout));
    } catch (error) {
        console.error('Failed to save layout:', error);
    }
}

export const getViewType = (path: string, layout: ViewType) => {
    try {
        const storedLayout = localStorage.getItem(getKey(path));
        if (storedLayout) {
            return JSON.parse(storedLayout) as ViewType;
        }
        return layout || defaultLayout;
    } catch (error) {
        console.error('Failed to get layout:', error);
        return layout || defaultLayout;
    }
}