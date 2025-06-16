import { Outlet } from 'react-router-dom'

export default function MainLayout() {
    return (
        <div className=' min-h-screen flex flex-col'>
            <nav className='w-full h-10 bg-gray-400'>

            </nav>
            <main className=' flex-1 py-10 px-30 bg-gray-50'>
                <Outlet />
            </main>
        </div>
    )
}
