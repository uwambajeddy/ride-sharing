import { Collection } from "@/components/shared/Collection"
import Header from "@/components/shared/Header"
import { RequestCollection } from "@/components/shared/RequestCollection";
import { getMyRequests } from "@/lib/actions/trip.actions"
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const MyRequests = async () => {
  const { userId } = auth();
  if(!userId) redirect('/sign-in')

  const user = await getUserById(userId);

  const requests = await getMyRequests(user._id);
  return (
    <>
      <Header 
         title="Trip requests"
         subtitle="Your Requests for a ride"
  
      />

      <section className="sm:mt-12">
        <RequestCollection
          trips={requests?.data}
          userId={user._id}
        />
      </section>
    </>
  )
}

export default MyRequests