import { router, usePage } from '@inertiajs/react';
import { Heart, Home, User, LogOut, LogIn, Loader2 } from 'lucide-react' 
import { useState } from 'react';

export default function BottomMenu() { 
    const { auth } = usePage().props as any;
    const { user } = auth

    const [isSigningOut, setIsSigningOut] = useState(false)

	const handleSignOut = async () => {
        router.post('/logout', {}, {
            onStart : () => setIsSigningOut(true),
            onFinish : () => setIsSigningOut(false)
        })
	}

	return (
		<>
			<div className="my-2 md:hidden">&nbsp;</div>
			<nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden mt-5 ">
				<div className="max-w-4xl mx-auto px-safe w-full bg-white/95 backdrop-blur-sm border-t border-gray-100 flex justify-between items-center py-2 px-4">
					<a
						href="/"
						className="flex-1 flex flex-col items-center text-gray-600 hover:text-purple-600 text-xs"
					>
						<Home className="w-3 h-3" />
						<span>Inicio</span>
					</a>
					{user && (
						<a
							href="/favorites"
							className="flex-1 flex flex-col items-center text-gray-600 hover:text-purple-600 text-xs"
						>
							<Heart className="w-3 h-3" />
							<span>Favoritos</span>
						</a>
					)}

					{user && (
						<a
							href="/dashboard/profile/business"
							className="flex-1 flex flex-col items-center text-gray-600 hover:text-purple-600 text-xs"
						>
							<User className="w-3 h-3" />
							<span>Perfil</span>
						</a>
					)}

					<div className="flex-1 flex flex-col items-center text-gray-600 hover:text-purple-600 text-xs ">
						{user ? (
							<button onClick={handleSignOut} className="flex flex-col  items-center cursor-pointer" disabled = {isSigningOut}>
                                { isSigningOut ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span>Saliendo ..</span>
                                    </>
                                    ) : (
                                        <>
                                            <LogOut className="w-3 h-3" />
                                            <span>Cerrar sesión</span>
                                        </>
                                    )
                                }
								
							</button>
						) : (
							<a
								className="flex flex-col items-center justify-center cursor-pointer"
								href='/login'
							>
								<LogIn className="w-3 h-3" />
								<span>Iniciar sesión</span>
							</a>
						)}
					</div>
				</div>
			</nav>
		</>
	)
}
