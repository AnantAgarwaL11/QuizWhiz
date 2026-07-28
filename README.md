# QuzWhiz

A full-stack real-time quiz platform built with Next.js 14, TypeScript, MongoDB, Clerk Authentication, Socket.io, Framer Motion, and Tailwind CSS.

QuzWhiz allows users to create, publish, and share quizzes through public links while participants compete on a live leaderboard that updates instantly as new submissions arrive.

**Live Demo:** https://o-quizz-ooo.vercel.app/

---

## Features

- Authentication with Clerk (Google & Email)
- Protected dashboard for quiz management
- Create and publish quizzes
- Share quizzes using public links
- Multiple-choice quiz system
- Secure server-side score calculation
- Real-time leaderboard updates with Socket.io
- Smooth animations powered by Framer Motion
- Fully responsive across devices
- Custom Neubrutalist UI

---

## How It Works

### Quiz Creation

Authenticated users can create quizzes by adding a title, description, and multiple-choice questions. Each question contains four options and a selected correct answer.

Correct answers are stored in MongoDB as `correctIndex` values and are never exposed to quiz participants.

### Quiz Participation

Published quizzes generate a public link that can be shared with anyone.

Participants can:

- Answer questions
- Track progress through the quiz
- Navigate through animated question transitions
- Submit responses for scoring

Scores are validated and calculated entirely on the server.

### Real-Time Leaderboards

After completing a quiz, users are redirected to a leaderboard page.

Leaderboard rankings update instantly through Socket.io whenever a new participant submits a quiz attempt.

---

## UI & Design

O-Quizz-0 follows a custom Neubrutalist design system built around:

- Thick black borders
- Hard offset shadows
- Bold typography
- High-contrast colors
- Floating UI elements
- Large interactive components

The interface is intentionally loud, playful, and highly interactive while remaining responsive and easy to use.

---

## Tech Stack

| Category       | Technology              |
| -------------- | ----------------------- |
| Framework      | Next.js 14 (App Router) |
| Language       | TypeScript              |
| Styling        | Tailwind CSS            |
| Animation      | Framer Motion           |
| Authentication | Clerk                   |
| Database       | MongoDB Atlas           |
| ODM            | Mongoose                |
| Realtime       | Socket.io               |
| Deployment     | Vercel                  |

---

## Security

Quiz answers are never exposed to the client.

All scoring is performed on the server by comparing submitted answers with stored `correctIndex` values in MongoDB. This prevents users from accessing answers through browser developer tools or network inspection.

Protected routes and dashboard access are handled using Clerk middleware.

---

## Environment Variables

Create a `.env.local` file in the root directory.

```env
MONGODB_URI=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard

NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

## Local Development

```bash
git clone https://github.com/anujgupta018/o-quizz-0.git

cd o-quizz-0

npm install

npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Project Structure

```text
src/
├── app/
    ├── api/
    ├── dashboard/
    ├── quiz/
    ├── sign-in/
    ├── sign-up/
├── components/
├── lib/
├── public/
```

---

## Contributing

Contributions, issues, and feature suggestions are welcome.

To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

Anuj Gupta

GitHub: https://github.com/anujgupta018
