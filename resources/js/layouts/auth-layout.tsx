
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: {
    children: React.ReactNode;
    title:  string;
    description: string;
    header?: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate
            {...props}
            title={
                <div className="flex flex-col items-center gap-3">
                    <img
                        src="/logouhuy3.png"
                        alt="Logo Uhuy"
                        className="h-14 md:h-20 w-auto object-contain"
                    />
                    <span className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {title}
                    </span>
                </div>
            }
            description={description}
        >
            {children}
        </AuthLayoutTemplate>
    );
}
