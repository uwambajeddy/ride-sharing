import Header from '@/components/shared/Header'
import TripForm from '@/components/shared/TripForm';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const CreateTrip = async () => {
  const { userId } = auth();

  if (!userId) redirect('/sign-in')

  const user = await getUserById(userId);

  return (
    <>
      <Header 
         title="Schedule a trip"
         subtitle="Fill in the form below to schedule a trip."
  
      />
    
      <section className="mt-10">
        <TripForm 
          action="Add"
          userId={user._id}
        />
      </section>
    </>
  )
}

export default CreateTrip