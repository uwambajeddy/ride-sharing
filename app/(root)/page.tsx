import { Collection } from "@/components/shared/Collection"
import { navLinks } from "@/constants"
import { getAllTrips } from "@/lib/actions/trip.actions"
import { getUserById } from "@/lib/actions/user.actions"
import { socket } from "@/lib/utils"
import { auth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

const Trips = async () => {
  const { userId } = auth();
  let user;

  if (userId) {
    user = await getUserById(userId);
  } else {
    socket.disconnect();
  }

  const trips = await getAllTrips({userId: user?._id })
  

  return (
    <>
      <section className="home">
        <h1 className="home-heading">
        Navigate Life Ride With Purpose
        </h1>
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2"
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection 
          hasTitle={true}
          userId={user?._id}
          trips={trips?.data}
        />
      </section>
    </>
  )
}

export default Trips