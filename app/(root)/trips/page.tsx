import { Collection } from "@/components/shared/Collection"
import Header from "@/components/shared/Header"
import { getMyTrips } from "@/lib/actions/trip.actions"
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const MyTrips = async () => {
  const { userId } = auth();
  if(!userId) redirect('/sign-in')

    const user = await getUserById(userId);
  
  const trips = await getMyTrips(user._id);

  return (
    <>
      <Header 
         title="My schedules"
         subtitle="Trips that you have scheduled"
  
      />

      <section className="sm:mt-12">
        <Collection
          hasTitle={false}
          trips={trips?.data}
          userId={user._id}
        />
      </section>
    </>
  )
}

export default MyTrips