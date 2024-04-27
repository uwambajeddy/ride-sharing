import { ActiveCollection } from "@/components/shared/ActiveCollection"
import { ActiveDriverCollection } from "@/components/shared/ActiveDriverCollection";
import Header from "@/components/shared/Header"
import { getActiveTrips } from "@/lib/actions/trip.actions"
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";



const ActiveTrips = async () => {
  const { userId } = auth();
  if(!userId) redirect('/sign-in')

  const user = await getUserById(userId);
  
  const trips = await getActiveTrips(user._id);


  return (
    <>
      <Header 
          title="Trips that are active"
        subtitle="Track driver location in realtime"
        />

      <section className="sm:mt-12">
        <ActiveCollection
          trips={trips?.data}
          userId={user._id}
          user={user}
        />
        <ActiveDriverCollection user={ user} />
      </section>
    </>
  )
}

export default ActiveTrips