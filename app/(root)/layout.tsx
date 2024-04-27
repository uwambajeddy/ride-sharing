import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import { Toaster } from '@/components/ui/toaster'
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';

const Layout = ({ children }: { children: React.ReactNode }) => {

  const { userId } = auth();

  let user;
  if (userId) {
    setTimeout(async() => {
      user = await getUserById(userId);
      
    },5000)
      }

  

  return (
    <main className="root">
      <Sidebar />
      <MobileNav />

      <div className="root-container">
        <div className="wrapper">
          {children}
        </div>
      </div>
      
      <Toaster user={user} />
    </main>
  )
}

export default Layout