# Ride Radar

Ride Radar is a web application that provides real-time tracking of public transportation vehicles (buses, trams, trains and metro) in the Helsinki Regional Transport Authority (HSL) area.

## Features

- Real-time vehicle tracking with high-frequency positioning updates
- Background map rendering to display vehicle locations

## APIs Used

The application utilizes the following two APIs to gather data:

1. **High-Frequency Positioning API**  
   [DigiTransit High-Frequency Positioning API](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/)

2. **Background Map API**  
   [DigiTransit Background Map API](https://digitransit.fi/en/developers/apis/4-map-api/background-map/)

## Real-Time Communication with MQTT.js

Ride Radar receives real-time data via WebSockets using the **MQTT.js** client.

- The app subscribes to MQTT topics to receive vehicle positioning data efficiently.
- incoming messages are batched, and state updates occur at intervals.

## CI/CD Setup

The project is set up with GitHub Actions for continuous integration and deployment.

- Automated tests, linting, format-checking and typechecking run on every push and pull request
- pull requests are deployed into Vercel's preview env
- push to main branch triggers production deploy

## Getting Started

To get started with this project locally, follow the instructions below:

### Prerequisites

- Node.js (22.x)
- [pnpm](https://pnpm.io/installation#using-corepack) (10.x)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Minilfat/ride-radar.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd ride-radar
   ```

3. **Install Dependencies**:

   ```bash
   pnpm install
   ```

4. **Set Up Environment Variables**:

   Rename the `.env.example` file to `.env.local` and configure the necessary environment variables.

5. **Start the Development Server**:

   ```bash
   pnpm dev
   ```

   The application will be accessible at `http://localhost:3000`.

## Deployment

Ride Radar is deployed and accessible at [ride-radar.vercel.app](https://ride-radar.vercel.app).

## Improvements & Future Work

Although the application provides a functional real-time vehicle position tracking system, there are areas for potential improvement:

- Message Processing Optimization. The message processing logic could be optimized by moving the processing from the main thread to a Web Worker before dispatching actions to Redux. This would improve performance, especially with a large number of real-time updates.

- Utilizing Topics with Geohash. The current method filters data on the frontend, but this could be optimized by utilizing geohash-based topics. However, the custom geohash format used in the API is custom andlacking any documentation, making this challenging to implement.

- Responsiveness

- Increase testing coverage :)
