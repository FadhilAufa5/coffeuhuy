import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center space-x-2">
            {/* Logo */}
            <AppLogoIcon className="w-10 h-10" />
        
            {/* Tulisan */}
            <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight truncate">
                    Admin
                </span>
                <span className="text-xs text-gray-500 truncate">
                    CoffeeUhuy
                </span>
            </div>
        </div>
    );
}
