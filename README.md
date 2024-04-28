<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://ride-sharing-virid.vercel.app">
    <img src="https://github.com/uwambajeddy/ride-sharing/assets/59047760/ef4f44fc-fece-427a-8a94-235b8603f4aa" alt="Logo" >
  </a>

  <h3 align="center">Ride-Sharing Web App</h3>


  <p align="center">
    Navigate Life Ride with purposes
    <br />

  </p>
</div>


<!-- ABOUT THE PROJECT -->
## About The Project
![Opera Snapshot_2024-04-27_034729_localhost](https://github.com/uwambajeddy/ride-sharing/assets/59047760/75522c08-3fb6-4598-a527-3597e965eff4)


The Ride-Sharing Web App is a platform that connects drivers and passengers for convenient and efficient transportation. It allows users to request rides and track their drivers in real-time.

### Built With

List of frameworks/libraries and languages used to bootstrap this project:

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Mongo-db][Mongo-db]][Mongo-db]
* [![Node][Node]][Node]
* [![Typescript][Typescript]][Typescript]



### Installation


1. Clone the repo
   ```sh
   git clone https://github.com/uwambajeddy/ride-sharing.git
   ```
2. Install NPM packages for the client-side and server-side
   ```sh
   cd client
   npm install
   cd ..
   cd server
   npm install
   ```
3. Place the required environment variables in `.env.local` file by following instructions in `.env.example` file
   

## Features
- User Registration: Users can create accounts and provide their personal information.
- Ride Request: Passengers can request rides by specifying their pickup and drop-off locations.
- Real-Time Tracking: Passengers can track their assigned driver's location in real-time.
- User authentication and authorization
- Trip creation and management
- Interactive maps for visualizing trip routes and passenger pickups
- Seamless integration with third-party APIs for geolocation and mapping services


## Usage

Here are the screenshots to provide you with a visual understanding of how the system operates, enhancing your user experience:

### Begin by logging into the system
![1](https://github.com/uwambajeddy/ride-sharing/assets/59047760/a1a9e445-169c-4b76-a7db-a84adde9ee91)
![2](https://github.com/uwambajeddy/ride-sharing/assets/59047760/cc1e2447-637c-4c64-ba90-685a818a5362)

## _Driver_
### Let's kick off by initiating the driver activities through scheduling a trip.

### Navigate to `create new trip` page
![3](https://github.com/uwambajeddy/ride-sharing/assets/59047760/f82dccf9-118b-412b-978f-2bfca3553ac4)

> By clicking on one of the inputs shown in the picture, the Map modal will display and you will have to mark the `Origin` and the `Destination` locations then click the `select location` button, submit the form and like that your trip is schedule.
![4](https://github.com/uwambajeddy/ride-sharing/assets/59047760/1bdfd1a7-3db7-4248-8a3d-ec7668458f65)
![5](https://github.com/uwambajeddy/ride-sharing/assets/59047760/cdea78b8-dc54-4222-92b2-85290410c8d9)
![6](https://github.com/uwambajeddy/ride-sharing/assets/59047760/0f31de1d-9048-4b18-ac77-8ed607e36715)

## _Passenger_
### Next step is to request a trip that have been created

> By logging into the system with a different account you will be able to request a ride
![7](https://github.com/uwambajeddy/ride-sharing/assets/59047760/6e1db89e-b062-4a60-9f30-c9715ed9ecec)

> When you request a ride you'll be asked to provide you pick up location and after request a ride your request status will be pending and you'll have to wait for the driver to `approve` or `reject` it.
![8](https://github.com/uwambajeddy/ride-sharing/assets/59047760/393ad71a-d00b-445c-8157-a53bce2c767b)
![9](https://github.com/uwambajeddy/ride-sharing/assets/59047760/33b29ff7-7014-476f-8499-cb6170fd9a53)


## _Driver_
_the window on the left is for driver account and the one on the right is for the passenger_

> As a driver, you have the option to either `approve` or `reject` requests before commencing the trip. Clicking on the passenger request photo will prompt a modal to appear, displaying the passenger's pickup location. You'll utilize this information to take appropriate action.
![10](https://github.com/uwambajeddy/ride-sharing/assets/59047760/4667d07e-d988-4136-b81f-fca892688890)
![11](https://github.com/uwambajeddy/ride-sharing/assets/59047760/c45f866b-df5b-4d70-97fe-2dc060e8d789)
![12](https://github.com/uwambajeddy/ride-sharing/assets/59047760/cde56afc-2d48-4ffc-a9b0-e7bc13e6359a)

### After the driver starts the trip both the passenger and the driver can navigate to the `active trip` page to watch the realtime driver location and once the trip is done the driver can mark it as completed
### ⚠️ N.B _when you start driver the starting point will always be your current location, not the one you set while scheduling the trip_
![Screenshot (1025)](https://github.com/uwambajeddy/ride-sharing/assets/59047760/111a9dff-a0d5-427b-8df6-655a5ebf3e9c)

![13](https://github.com/uwambajeddy/ride-sharing/assets/59047760/5fe86183-fa89-4c77-904a-dad0a9b53ae7)


## License
This project is licensed under the [MIT License](LICENSE).


[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Google-maps]: https://cdn.icon-icons.com/icons2/2699/PNG/512/google_maps_tile_logo_icon_169082.png
[Socket-io]: https://www.vectorlogo.zone/logos/socketio/socketio-ar21.png
[Mongo-db]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[Express]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Node]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white




